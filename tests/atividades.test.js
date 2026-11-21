const request = require('supertest');
const app = require('../src/app');
const { Aluno, AlunoAtividade, AlunoConquista, Conquista } = require('../src/models');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

let tokenProfessor;
let tokenAluno;
let tokenOutroProfessor;
let idAluno;
let idAtividade;

async function criarAluno(email) {
  await request(app).post('/api/alunos').send({
    nome: `Aluno ${email}`,
    dt_nasc: '2008-01-01',
    email,
    senha: 'senha123'
  });
  const login = await request(app).post('/api/auth/login').send({ email, senha: 'senha123' });
  return login.body;
}

async function criarProfessor(email, nomeEscola, emailEscola) {
  await request(app).post('/api/escolas').send({
    nome: nomeEscola,
    dt_nasc: '2000-01-01',
    email: emailEscola,
    senha: 'senha123'
  });
  const loginEscola = await request(app)
    .post('/api/auth/login')
    .send({ email: emailEscola, senha: 'senha123' });

  await request(app)
    .post('/api/escolas/professores')
    .set('Authorization', `Bearer ${loginEscola.body.token}`)
    .send({
      nome: `Professor ${email}`,
      dt_nasc: '1985-01-01',
      email,
      senha: 'senha123'
    });

  const login = await request(app).post('/api/auth/login').send({ email, senha: 'senha123' });
  return login.body;
}

const atividadeBase = {
  nome_atividade: 'Matemática básica',
  pergunta: 'Quanto é 2 + 2?',
  id_nivel_ensino: 1,
  tipo: 'multipla_escolha',
  alternativas: [
    { resposta: '3', validade: false },
    { resposta: '4', validade: true }
  ],
  conteudos: [{ tipo: 'imagem', caminho: '/conteudos/2mais2.png' }]
};

beforeAll(async () => {
  const professor = await criarProfessor('prof@teste.com', 'Escola A', 'escolaa@teste.com');
  tokenProfessor = professor.token;

  const outro = await criarProfessor('prof2@teste.com', 'Escola B', 'escolab@teste.com');
  tokenOutroProfessor = outro.token;

  const aluno = await criarAluno('aluno-atividade@teste.com');
  tokenAluno = aluno.token;
  idAluno = aluno.usuario.id_usuario;
});

test('professor cadastra atividade com alternativas e conteúdos', async () => {
  const resposta = await request(app)
    .post('/api/atividades')
    .set('Authorization', `Bearer ${tokenProfessor}`)
    .send(atividadeBase);

  expect(resposta.status).toBe(201);
  expect(resposta.body.alternativas).toHaveLength(2);
  expect(resposta.body.alternativas[1].validade).toBe(true);
  expect(resposta.body.conteudos[0].caminho).toBe('/conteudos/2mais2.png');
  idAtividade = resposta.body.id_atividade;
});

test('atividade exige exatamente uma alternativa correta', async () => {
  const resposta = await request(app)
    .post('/api/atividades')
    .set('Authorization', `Bearer ${tokenProfessor}`)
    .send({
      ...atividadeBase,
      alternativas: [
        { resposta: '3', validade: true },
        { resposta: '4', validade: true }
      ]
    });

  expect(resposta.status).toBe(400);
});

test('consulta do aluno não revela a alternativa correta', async () => {
  const resposta = await request(app)
    .get(`/api/atividades/${idAtividade}`)
    .set('Authorization', `Bearer ${tokenAluno}`);

  expect(resposta.status).toBe(200);
  expect(resposta.body.alternativas[0].validade).toBeUndefined();
});

test('professor não edita atividade de outro professor', async () => {
  const resposta = await request(app)
    .put(`/api/atividades/${idAtividade}`)
    .set('Authorization', `Bearer ${tokenOutroProfessor}`)
    .send({ nome_atividade: 'Invadida' });

  expect(resposta.status).toBe(403);
});

test('resposta errada desconta moedas sem concluir a atividade', async () => {
  await Aluno.update({ moedas: 100 }, { where: { id_usuario: idAluno } });

  const atividade = await request(app)
    .get(`/api/atividades/${idAtividade}`)
    .set('Authorization', `Bearer ${tokenAluno}`);

  const errada = atividade.body.alternativas.find((alternativa) => alternativa.resposta === '3');

  const resposta = await request(app)
    .post(`/api/atividades/${idAtividade}/responder`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ id_resposta: errada.id_resposta });

  expect(resposta.status).toBe(200);
  expect(resposta.body.correta).toBe(false);
  expect(resposta.body.moedas).toBe(85);

  const conclusoes = await AlunoAtividade.count({ where: { id_usuario: idAluno } });
  expect(conclusoes).toBe(0);
});

test('saldo de moedas nunca fica negativo', async () => {
  await Aluno.update({ moedas: 5 }, { where: { id_usuario: idAluno } });
  const atividade = await request(app)
    .get(`/api/atividades/${idAtividade}`)
    .set('Authorization', `Bearer ${tokenAluno}`);
  const errada = atividade.body.alternativas.find((alternativa) => alternativa.resposta === '3');

  const resposta = await request(app)
    .post(`/api/atividades/${idAtividade}/responder`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ id_resposta: errada.id_resposta });

  expect(resposta.body.moedas).toBe(0);
});

test('resposta correta conclui, recompensa uma única vez e desbloqueia conquista', async () => {
  await Conquista.create({
    nome_conquista: 'Primeira atividade',
    tipo_requisito: 'atividades_concluidas',
    valor_requisito: 1
  });

  const atividade = await request(app)
    .get(`/api/atividades/${idAtividade}`)
    .set('Authorization', `Bearer ${tokenAluno}`);
  const correta = atividade.body.alternativas.find((alternativa) => alternativa.resposta === '4');

  const resposta = await request(app)
    .post(`/api/atividades/${idAtividade}/responder`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ id_resposta: correta.id_resposta });

  expect(resposta.status).toBe(200);
  expect(resposta.body.correta).toBe(true);
  expect(resposta.body.moedas).toBe(10);

  const conclusoes = await AlunoAtividade.count({ where: { id_usuario: idAluno } });
  expect(conclusoes).toBe(1);

  const conquistas = await AlunoConquista.count({ where: { aluno_id_usuario: idAluno } });
  expect(conquistas).toBe(1);

  const repetida = await request(app)
    .post(`/api/atividades/${idAtividade}/responder`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ id_resposta: correta.id_resposta });

  expect(repetida.status).toBe(409);
  const aluno = await Aluno.findByPk(idAluno);
  expect(aluno.moedas).toBe(10);
});

test('atividade inativa não pode ser respondida', async () => {
  await request(app)
    .patch(`/api/atividades/${idAtividade}/status`)
    .set('Authorization', `Bearer ${tokenProfessor}`)
    .send({ ativo: false });

  const resposta = await request(app)
    .post(`/api/atividades/${idAtividade}/responder`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ id_resposta: 1 });

  expect(resposta.status).toBe(400);
});

test('lista atividades concluídas do aluno', async () => {
  const resposta = await request(app)
    .get('/api/atividades/concluidas')
    .set('Authorization', `Bearer ${tokenAluno}`);

  expect(resposta.status).toBe(200);
  expect(resposta.body).toHaveLength(1);
  expect(resposta.body[0].id_atividade).toBe(idAtividade);
});
