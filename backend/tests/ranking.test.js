const request = require('supertest');
const app = require('../src/app');
const { Aluno, Usuario } = require('../src/models');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

const alunos = [];

async function criarAluno(nome, email, moedas, vitorias = 0) {
  await request(app).post('/api/alunos').send({
    nome,
    dt_nasc: '2008-01-01',
    email,
    senha: 'senha123'
  });
  const login = await request(app).post('/api/auth/login').send({ email, senha: 'senha123' });
  const usuario = await Usuario.findOne({ where: { email } });
  await Aluno.update(
    { moedas, vitorias_pvp: vitorias },
    { where: { id_usuario: usuario.id_usuario } }
  );
  const aluno = { nome, token: login.body.token, id_usuario: usuario.id_usuario };
  alunos.push(aluno);
  return aluno;
}

beforeAll(async () => {
  await criarAluno('João', 'joao@ranking.com', 100, 3);
  await criarAluno('Maria', 'maria@ranking.com', 90, 1);
  await criarAluno('Pedro', 'pedro@ranking.com', 80, 0);
  await criarAluno('Ana', 'ana@ranking.com', 70, 0);
  await criarAluno('Lucas', 'lucas@ranking.com', 60, 0);
  await criarAluno('Carla', 'carla@ranking.com', 50, 0);
  await criarAluno('Rafael', 'rafael@ranking.com', 40, 0);
});

test('ranking exige autenticação', async () => {
  const resposta = await request(app).get('/api/ranking');
  expect(resposta.status).toBe(401);
});

test('retorna top 5 e o usuário autenticado fora do top 5 com posição real', async () => {
  const resposta = await request(app)
    .get('/api/ranking')
    .set('Authorization', `Bearer ${alunos[6].token}`);

  expect(resposta.status).toBe(200);
  expect(resposta.body).toEqual([
    { posicao: 1, nome: 'João' },
    { posicao: 2, nome: 'Maria' },
    { posicao: 3, nome: 'Pedro' },
    { posicao: 4, nome: 'Ana' },
    { posicao: 5, nome: 'Lucas' },
    { posicao: 7, nome: 'Rafael' }
  ]);
});

test('não duplica o usuário autenticado quando ele está no top 5', async () => {
  const resposta = await request(app)
    .get('/api/ranking')
    .set('Authorization', `Bearer ${alunos[2].token}`);

  expect(resposta.status).toBe(200);
  expect(resposta.body).toHaveLength(5);
  expect(resposta.body[2]).toEqual({ posicao: 3, nome: 'Pedro' });
});

test('inclui usuário na sexta posição sem reiniciar a contagem', async () => {
  const resposta = await request(app)
    .get('/api/ranking')
    .set('Authorization', `Bearer ${alunos[5].token}`);

  expect(resposta.body).toHaveLength(6);
  expect(resposta.body[5]).toEqual({ posicao: 6, nome: 'Carla' });
});
