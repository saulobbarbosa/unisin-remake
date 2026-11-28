const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Usuario, Administrador } = require('../src/models');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

let tokenAdmin;
let tokenAluno;
let idAluno;
let idModulo;

async function login(email, senha) {
  const resposta = await request(app).post('/api/auth/login').send({ email, senha });
  return resposta.body.token;
}

beforeAll(async () => {
  const admin = await Usuario.create({
    nome: 'Admin Módulos',
    dt_nasc: '1990-01-01',
    email: 'admin-modulos@teste.com',
    senha: await bcrypt.hash('senha123', 4)
  });
  await Administrador.create({ id_usuario: admin.id_usuario });
  tokenAdmin = await login('admin-modulos@teste.com', 'senha123');

  await request(app).post('/api/alunos').send({
    nome: 'Aluno Módulos',
    dt_nasc: '2008-01-01',
    email: 'aluno-modulos@teste.com',
    senha: 'senha123'
  });
  tokenAluno = await login('aluno-modulos@teste.com', 'senha123');
  const aluno = await Usuario.findOne({ where: { email: 'aluno-modulos@teste.com' } });
  idAluno = aluno.id_usuario;
});

test('somente perfis autorizados cadastram módulos', async () => {
  const negado = await request(app)
    .post('/api/modulos')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ nome: 'Ilegal' });
  expect(negado.status).toBe(403);

  const modulo = await request(app)
    .post('/api/modulos')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ nome: 'Frações' });
  expect(modulo.status).toBe(201);
  idModulo = modulo.body.id_modulo_ensino;
});

test('associa módulo ao aluno e nível, sem duplicidade', async () => {
  const associacao = await request(app)
    .post(`/api/modulos/${idModulo}/alunos`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ id_aluno: idAluno, id_nivel_ensino: 1 });

  expect(associacao.status).toBe(201);
  expect(associacao.body.status).toBe('nao_iniciado');

  const duplicada = await request(app)
    .post(`/api/modulos/${idModulo}/alunos`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ id_aluno: idAluno, id_nivel_ensino: 1 });
  expect(duplicada.status).toBe(409);

  const meus = await request(app)
    .get('/api/modulos/meus')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(meus.body).toHaveLength(1);
  expect(meus.body[0].id_modulo_ensino).toBe(idModulo);
  expect(meus.body[0].nivel_ensino.nome).toBe('Fundamental I');
});

test('atualiza progresso, registra e limpa data de conclusão', async () => {
  const emAndamento = await request(app)
    .patch(`/api/modulos/${idModulo}/progresso`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ id_nivel_ensino: 1, status: 'em_andamento' });
  expect(emAndamento.status).toBe(200);
  expect(emAndamento.body.status).toBe('em_andamento');
  expect(emAndamento.body.data_conclusao).toBeNull();

  const concluido = await request(app)
    .patch(`/api/modulos/${idModulo}/progresso`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ id_nivel_ensino: 1, status: 'concluido' });
  expect(concluido.status).toBe(200);
  expect(concluido.body.data_conclusao).not.toBeNull();

  const reaberto = await request(app)
    .patch(`/api/modulos/${idModulo}/progresso`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ id_nivel_ensino: 1, status: 'em_andamento' });
  expect(reaberto.body.data_conclusao).toBeNull();
});

test('rejeita status inválido e progresso sem matrícula', async () => {
  const invalido = await request(app)
    .patch(`/api/modulos/${idModulo}/progresso`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ id_nivel_ensino: 1, status: 'finalizado' });
  expect(invalido.status).toBe(400);

  const semMatricula = await request(app)
    .patch(`/api/modulos/${idModulo}/progresso`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ id_nivel_ensino: 2, status: 'em_andamento' });
  expect(semMatricula.status).toBe(404);
});

test('consulta módulo com níveis e alunos associados', async () => {
  const detalhe = await request(app)
    .get(`/api/modulos/${idModulo}`)
    .set('Authorization', `Bearer ${tokenAdmin}`);

  expect(detalhe.status).toBe(200);
  expect(detalhe.body.nome).toBe('Frações');
  expect(detalhe.body.niveis[0].nome).toBe('Fundamental I');
  expect(detalhe.body.alunos).toHaveLength(1);
  expect(detalhe.body.alunos[0].id_usuario).toBe(idAluno);

  const lista = await request(app)
    .get('/api/modulos')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(lista.body).toHaveLength(1);
});

test('administrador edita o nome do módulo', async () => {
  const resposta = await request(app)
    .put(`/api/modulos/${idModulo}`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ nome: 'Frações e Decimais' });

  expect(resposta.status).toBe(200);
  expect(resposta.body.nome).toBe('Frações e Decimais');
});

test('calcula o nível médio dos módulos nas rotas de aluno e usuário', async () => {
  const outro = await request(app)
    .post('/api/modulos')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ nome: 'Geometria' });

  await request(app)
    .post(`/api/modulos/${outro.body.id_modulo_ensino}/alunos`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ id_aluno: idAluno, id_nivel_ensino: 3 });

  const aluno = await request(app)
    .get('/api/alunos/me')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(aluno.body.nivel).toBe(2);

  const usuario = await request(app)
    .get('/api/usuarios/me')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(usuario.body.nivel).toBe(2);
});
