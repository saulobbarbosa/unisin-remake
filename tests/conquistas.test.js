const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Usuario, Administrador, Aluno } = require('../src/models');
const ConquistaService = require('../src/services/ConquistaService');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

let tokenAdmin;
let tokenAluno;
let idAluno;
let idConquista;

async function login(email, senha) {
  const resposta = await request(app).post('/api/auth/login').send({ email, senha });
  return resposta.body.token;
}

beforeAll(async () => {
  const admin = await Usuario.create({
    nome: 'Admin Conquistas',
    dt_nasc: '1990-01-01',
    email: 'admin-conquistas@teste.com',
    senha: await bcrypt.hash('senha123', 4)
  });
  await Administrador.create({ id_usuario: admin.id_usuario });
  tokenAdmin = await login('admin-conquistas@teste.com', 'senha123');

  await request(app).post('/api/alunos').send({
    nome: 'Aluno Conquistas',
    dt_nasc: '2008-01-01',
    email: 'aluno-conquistas@teste.com',
    senha: 'senha123'
  });
  tokenAluno = await login('aluno-conquistas@teste.com', 'senha123');
  const aluno = await Usuario.findOne({ where: { email: 'aluno-conquistas@teste.com' } });
  idAluno = aluno.id_usuario;
});

test('somente administrador cadastra conquistas', async () => {
  const negado = await request(app)
    .post('/api/conquistas')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({
      nome_conquista: 'Ilegal',
      tipo_requisito: 'vitorias_pvp',
      valor_requisito: 1
    });
  expect(negado.status).toBe(403);

  const conquista = await request(app)
    .post('/api/conquistas')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      nome_conquista: 'Cinco vitórias',
      descricao: 'Vença cinco partidas PvP',
      tipo_requisito: 'vitorias_pvp',
      valor_requisito: 5
    });

  expect(conquista.status).toBe(201);
  idConquista = conquista.body.id_conquista;
});

test('rejeita tipo de requisito inválido', async () => {
  const resposta = await request(app)
    .post('/api/conquistas')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      nome_conquista: 'Inválida',
      tipo_requisito: 'moedas',
      valor_requisito: 1
    });
  expect(resposta.status).toBe(400);
});

test('verificação desbloqueia uma única vez e minhas conquistas reflete', async () => {
  await Aluno.update({ vitorias_pvp: 5 }, { where: { id_usuario: idAluno } });

  const primeira = await ConquistaService.verificarConquistas(idAluno);
  expect(primeira).toHaveLength(1);
  expect(primeira[0].nome_conquista).toBe('Cinco vitórias');

  const segunda = await ConquistaService.verificarConquistas(idAluno);
  expect(segunda).toHaveLength(0);

  const minhas = await request(app)
    .get('/api/conquistas/minhas')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(minhas.body).toHaveLength(1);
  expect(minhas.body[0].id_conquista).toBe(idConquista);
});

test('lista conquistas ativas e oculta inativas', async () => {
  const ativas = await request(app)
    .get('/api/conquistas')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(ativas.body).toHaveLength(1);

  await request(app)
    .patch(`/api/conquistas/${idConquista}/status`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ ativa: false });

  const depois = await request(app)
    .get('/api/conquistas')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(depois.body).toHaveLength(0);
});

test('administrador edita conquista', async () => {
  const resposta = await request(app)
    .put(`/api/conquistas/${idConquista}`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ nome_conquista: 'Cinco vitórias PvP', valor_requisito: 5 });

  expect(resposta.status).toBe(200);
  expect(resposta.body.nome_conquista).toBe('Cinco vitórias PvP');
});
