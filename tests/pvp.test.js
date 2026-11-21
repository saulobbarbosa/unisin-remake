process.env.PVP_QUANTIDADE_QUESTOES = '1';

jest.setTimeout(20000);

const http = require('http');
const request = require('supertest');
const { io: criarCliente } = require('socket.io-client');
const app = require('../src/app');
const { configurarSocket } = require('../src/socket');
const { Aluno, Resposta } = require('../src/models');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

let servidor;
let io;
let url;
let clienteA;
let clienteB;
let alunoA;
let alunoB;
let alunoC;
let idAtividade;
let idCorreta;
let idErrada;

function conectar(token) {
  return new Promise((resolve, reject) => {
    const socket = criarCliente(url, {
      auth: { token },
      transports: ['websocket'],
      reconnection: false
    });
    socket.on('connect', () => resolve(socket));
    socket.on('connect_error', reject);
  });
}

function aguardar(socket, evento) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Timeout ao aguardar evento ${evento}`)),
      5000
    );
    socket.once(evento, (dados) => {
      clearTimeout(timer);
      resolve(dados);
    });
  });
}

function responderPeloSocket(socket, dados) {
  return new Promise((resolve, reject) => {
    socket.emit('pvp:responder', dados, (resposta) => {
      if (resposta && resposta.ok) return resolve(resposta);
      return reject(new Error(resposta ? resposta.erro : 'Sem resposta'));
    });
  });
}

async function criarAluno(nome, email) {
  await request(app).post('/api/alunos').send({
    nome,
    dt_nasc: '2008-01-01',
    email,
    senha: 'senha123'
  });
  const login = await request(app).post('/api/auth/login').send({ email, senha: 'senha123' });
  return login.body;
}

beforeAll(async () => {
  await prepararBanco();

  servidor = http.createServer(app);
  io = configurarSocket(servidor);
  await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
  url = `http://127.0.0.1:${servidor.address().port}`;

  alunoA = await criarAluno('Jogador A', 'jogadora@teste.com');
  alunoB = await criarAluno('Jogador B', 'jogadorb@teste.com');
  alunoC = await criarAluno('Jogador C', 'jogadorc@teste.com');

  await request(app)
    .post('/api/amigos')
    .set('Authorization', `Bearer ${alunoA.token}`)
    .send({ id_amigo: alunoB.usuario.id_usuario });

  await request(app).post('/api/escolas').send({
    nome: 'Escola PvP',
    dt_nasc: '2000-01-01',
    email: 'escola-pvp@teste.com',
    senha: 'senha123'
  });
  const loginEscola = await request(app)
    .post('/api/auth/login')
    .send({ email: 'escola-pvp@teste.com', senha: 'senha123' });

  await request(app)
    .post('/api/escolas/professores')
    .set('Authorization', `Bearer ${loginEscola.body.token}`)
    .send({
      nome: 'Professor PvP',
      dt_nasc: '1985-01-01',
      email: 'prof-pvp@teste.com',
      senha: 'senha123'
    });
  const loginProfessor = await request(app)
    .post('/api/auth/login')
    .send({ email: 'prof-pvp@teste.com', senha: 'senha123' });

  const atividade = await request(app)
    .post('/api/atividades')
    .set('Authorization', `Bearer ${loginProfessor.body.token}`)
    .send({
      nome_atividade: 'Pergunta PvP',
      pergunta: 'Quanto é 1 + 1?',
      id_nivel_ensino: 1,
      tipo: 'multipla_escolha',
      alternativas: [
        { resposta: '1', validade: false },
        { resposta: '2', validade: true }
      ]
    });

  idAtividade = atividade.body.id_atividade;
  const alternativas = await Resposta.findAll({
    where: { atividade_id_atividade: idAtividade }
  });
  idCorreta = alternativas.find((alternativa) => alternativa.validade).id_resposta;
  idErrada = alternativas.find((alternativa) => !alternativa.validade).id_resposta;

  clienteA = await conectar(alunoA.token);
  clienteB = await conectar(alunoB.token);
});

afterAll(async () => {
  if (clienteA) clienteA.close();
  if (clienteB) clienteB.close();
  if (io) await new Promise((resolve) => io.close(resolve));
  await fecharBanco();
});

test('só permite convidar amigos', async () => {
  const resposta = await request(app)
    .post('/api/pvp/convites')
    .set('Authorization', `Bearer ${alunoA.token}`)
    .send({ id_amigo: alunoC.usuario.id_usuario });

  expect(resposta.status).toBe(400);
});

test('adversário pode recusar um convite', async () => {
  const convitePendente = aguardar(clienteB, 'pvp:convite');
  const convite = await request(app)
    .post('/api/pvp/convites')
    .set('Authorization', `Bearer ${alunoA.token}`)
    .send({ id_amigo: alunoB.usuario.id_usuario });
  expect(convite.status).toBe(201);
  await convitePendente;

  const recusaRecebida = aguardar(clienteA, 'pvp:convite_recusado');
  const recusa = await request(app)
    .post(`/api/pvp/convites/${convite.body.id_convite}/recusar`)
    .set('Authorization', `Bearer ${alunoB.token}`)
    .send({});
  expect(recusa.status).toBe(200);
  await recusaRecebida;
});

test('partida sincroniza perguntas, valida respostas e recompensa o vencedor', async () => {
  const convitePendente = aguardar(clienteB, 'pvp:convite');
  const convite = await request(app)
    .post('/api/pvp/convites')
    .set('Authorization', `Bearer ${alunoA.token}`)
    .send({ id_amigo: alunoB.usuario.id_usuario });
  await convitePendente;

  const inicioA = aguardar(clienteA, 'pvp:partida_iniciada');
  const inicioB = aguardar(clienteB, 'pvp:partida_iniciada');

  const aceite = await request(app)
    .post(`/api/pvp/convites/${convite.body.id_convite}/aceitar`)
    .set('Authorization', `Bearer ${alunoB.token}`)
    .send({});

  expect(aceite.status).toBe(200);
  expect(aceite.body.questaoAtual.id_atividade).toBe(idAtividade);
  expect(aceite.body.questaoAtual.alternativas[0].validade).toBeUndefined();

  const [partidaA, partidaB] = await Promise.all([inicioA, inicioB]);
  expect(partidaA.id_partida).toBe(aceite.body.id_partida);
  expect(partidaB.id_partida).toBe(aceite.body.id_partida);

  const resultadoA = aguardar(clienteA, 'pvp:resultado');
  const resultadoB = aguardar(clienteB, 'pvp:resultado');

  const respostaA = await responderPeloSocket(clienteA, {
    id_partida: aceite.body.id_partida,
    id_atividade: idAtividade,
    id_resposta: idCorreta
  });
  expect(respostaA.aguardando).toBe(true);

  await responderPeloSocket(clienteB, {
    id_partida: aceite.body.id_partida,
    id_atividade: idAtividade,
    id_resposta: idErrada
  });

  const [finalA, finalB] = await Promise.all([resultadoA, resultadoB]);
  expect(finalA.vencedor).toBe(alunoA.usuario.id_usuario);
  expect(finalB.vencedor).toBe(alunoA.usuario.id_usuario);
  expect(finalA.recompensa).toBe(20);

  const jogadorA = await Aluno.findByPk(alunoA.usuario.id_usuario);
  const jogadorB = await Aluno.findByPk(alunoB.usuario.id_usuario);
  expect(jogadorA.moedas).toBe(20);
  expect(jogadorA.vitorias_pvp).toBe(1);
  expect(jogadorB.moedas).toBe(0);
  expect(jogadorB.vitorias_pvp).toBe(0);

  const vitorias = await request(app)
    .get('/api/pvp/vitorias')
    .set('Authorization', `Bearer ${alunoA.token}`);
  expect(vitorias.body.vitorias_pvp).toBe(1);

  const partidaAtual = await request(app)
    .get('/api/pvp/partida/atual')
    .set('Authorization', `Bearer ${alunoA.token}`);
  expect(partidaAtual.body.finalizada).toBe(true);
  expect(partidaAtual.body.resultado.vencedor).toBe(alunoA.usuario.id_usuario);
});
