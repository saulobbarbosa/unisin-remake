process.env.AVALIACAO_QUANTIDADE_QUESTOES = '2';

const request = require('supertest');
const app = require('../src/app');
const { Aluno, AlunoAtividade, Resposta } = require('../src/models');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

let tokenAluno;
let idAluno;
let tokenProfessor;

async function criarAtividade(nome) {
  const resposta = await request(app)
    .post('/api/atividades')
    .set('Authorization', `Bearer ${tokenProfessor}`)
    .send({
      nome_atividade: nome,
      pergunta: `Pergunta ${nome}?`,
      id_nivel_ensino: 1,
      tipo: 'multipla_escolha',
      alternativas: [
        { resposta: 'Errada', validade: false },
        { resposta: 'Certa', validade: true }
      ]
    });
  return resposta.body.id_atividade;
}

async function respostaCorreta(id_atividade) {
  return Resposta.findOne({ where: { atividade_id_atividade: id_atividade, validade: true } });
}

async function responderTodas(questoes, acertar) {
  const respostas = [];
  for (let indice = 0; indice < questoes.length; indice += 1) {
    const questao = questoes[indice];
    const correta = await respostaCorreta(questao.id_atividade);
    const alternativa =
      acertar || (acertar === undefined && indice === 0)
        ? correta
        : questao.alternativas.find((item) => item.id_resposta !== correta.id_resposta);
    respostas.push({ id_atividade: questao.id_atividade, id_resposta: alternativa.id_resposta });
  }
  return respostas;
}

beforeAll(async () => {
  await request(app).post('/api/escolas').send({
    nome: 'Escola Avaliação',
    dt_nasc: '2000-01-01',
    email: 'escola-avaliacao@teste.com',
    senha: 'senha123'
  });
  const loginEscola = await request(app)
    .post('/api/auth/login')
    .send({ email: 'escola-avaliacao@teste.com', senha: 'senha123' });

  await request(app)
    .post('/api/escolas/professores')
    .set('Authorization', `Bearer ${loginEscola.body.token}`)
    .send({
      nome: 'Professor Avaliação',
      dt_nasc: '1985-01-01',
      email: 'prof-avaliacao@teste.com',
      senha: 'senha123'
    });

  const loginProfessor = await request(app)
    .post('/api/auth/login')
    .send({ email: 'prof-avaliacao@teste.com', senha: 'senha123' });
  tokenProfessor = loginProfessor.body.token;

  await request(app).post('/api/alunos').send({
    nome: 'Aluno Avaliação',
    dt_nasc: '2008-01-01',
    email: 'aluno-avaliacao@teste.com',
    senha: 'senha123'
  });
  const loginAluno = await request(app)
    .post('/api/auth/login')
    .send({ email: 'aluno-avaliacao@teste.com', senha: 'senha123' });
  tokenAluno = loginAluno.body.token;
  idAluno = loginAluno.body.usuario.id_usuario;

  await criarAtividade('A');
  await criarAtividade('B');
  await criarAtividade('C');
});

test('finalizar sem iniciar retorna erro', async () => {
  const resposta = await request(app)
    .post('/api/avaliacoes/finalizar')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ respostas: [] });

  expect(resposta.status).toBe(400);
});

test('inicia avaliação com questões ativas e sem revelar respostas', async () => {
  const resposta = await request(app)
    .post('/api/avaliacoes/iniciar')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});

  expect(resposta.status).toBe(200);
  expect(resposta.body.questoes).toHaveLength(2);
  expect(resposta.body.questoes[0].alternativas[0].validade).toBeUndefined();
});

test('100% de acertos atualiza o aluno para o nível mais alto', async () => {
  const inicio = await request(app)
    .post('/api/avaliacoes/iniciar')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});
  const respostas = await responderTodas(inicio.body.questoes, true);

  const resposta = await request(app)
    .post('/api/avaliacoes/finalizar')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ respostas });

  expect(resposta.status).toBe(200);
  expect(resposta.body.acertos).toBe(2);
  expect(resposta.body.percentual).toBe(100);
  expect(resposta.body.nivel.nome).toBe('Ensino Médio');

  const aluno = await Aluno.findByPk(idAluno);
  expect(aluno.id_nivel_ensino).toBe(3);

  const conclusoes = await AlunoAtividade.count({ where: { id_usuario: idAluno } });
  expect(conclusoes).toBe(0);
});

test('50% de acertos define o nível intermediário', async () => {
  const inicio = await request(app)
    .post('/api/avaliacoes/iniciar')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});
  const respostas = await responderTodas(inicio.body.questoes);

  const resposta = await request(app)
    .post('/api/avaliacoes/finalizar')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ respostas });

  expect(resposta.body.percentual).toBe(50);
  expect(resposta.body.nivel.nome).toBe('Fundamental II');
});

test('0% de acertos define o nível mais baixo', async () => {
  const inicio = await request(app)
    .post('/api/avaliacoes/iniciar')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});
  const respostas = await responderTodas(inicio.body.questoes, false);

  const resposta = await request(app)
    .post('/api/avaliacoes/finalizar')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ respostas });

  expect(resposta.body.percentual).toBe(0);
  expect(resposta.body.nivel.nome).toBe('Fundamental I');
});
