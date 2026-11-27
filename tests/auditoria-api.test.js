const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Usuario, Administrador, LogAuditoria } = require('../src/models');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

let tokenAdmin;
let tokenAluno;

beforeAll(async () => {
  const admin = await Usuario.create({
    nome: 'Admin API',
    dt_nasc: '1990-01-01',
    email: 'admin-api@teste.com',
    senha: await bcrypt.hash('senha123', 4)
  });
  await Administrador.create({ id_usuario: admin.id_usuario });
  tokenAdmin = (
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin-api@teste.com', senha: 'senha123' })
  ).body.token;

  await request(app).post('/api/alunos').send({
    nome: 'Aluno API',
    dt_nasc: '2008-01-01',
    email: 'aluno-api@teste.com',
    senha: 'senha123'
  });
  tokenAluno = (
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'aluno-api@teste.com', senha: 'senha123' })
  ).body.token;
});

test('somente administrador acessa a auditoria', async () => {
  expect((await request(app).get('/api/auditoria')).status).toBe(401);

  const listaAluno = await request(app)
    .get('/api/auditoria')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(listaAluno.status).toBe(403);

  const verificarAluno = await request(app)
    .get('/api/auditoria/verificar')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(verificarAluno.status).toBe(403);
});

test('lista blocos e detecta adulteração pela API', async () => {
  const lista = await request(app)
    .get('/api/auditoria')
    .set('Authorization', `Bearer ${tokenAdmin}`);

  expect(lista.status).toBe(200);
  expect(lista.body).toHaveLength(1);
  expect(lista.body[0].entidade).toBe('usuario');
  expect(lista.body[0].hash_atual).toMatch(/^[a-f0-9]{64}$/);

  const verificacao = await request(app)
    .get('/api/auditoria/verificar')
    .set('Authorization', `Bearer ${tokenAdmin}`);
  expect(verificacao.body).toMatchObject({
    integra: true,
    total: lista.body.length,
    problemas: []
  });

  const alvo = await LogAuditoria.findOne({ order: [['id_log', 'ASC']] });
  await LogAuditoria.update(
    { detalhes: '{"nome":"ADULTERADO"}' },
    { where: { id_log: alvo.id_log } }
  );

  const adulterada = await request(app)
    .get('/api/auditoria/verificar')
    .set('Authorization', `Bearer ${tokenAdmin}`);
  expect(adulterada.body.integra).toBe(false);
  expect(
    adulterada.body.problemas.some((problema) => problema.id_log === alvo.id_log)
  ).toBe(true);
});
