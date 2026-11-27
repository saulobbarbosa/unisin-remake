const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Usuario, Administrador, Aluno } = require('../src/models');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

let admin;
let escola;
let professor;
let aluno;
let idAtividade;
let idItem;
let idModulo;
let tokenAdmin;

async function login(email, senha) {
  return request(app).post('/api/auth/login').send({ email, senha });
}

beforeAll(async () => {
  const usuarioAdmin = await Usuario.create({
    nome: 'Admin Rotas',
    dt_nasc: '1990-01-01',
    email: 'admin-rotas@teste.com',
    senha: await bcrypt.hash('senha123', 4)
  });
  await Administrador.create({ id_usuario: usuarioAdmin.id_usuario });
  admin = (await login('admin-rotas@teste.com', 'senha123')).body;
  tokenAdmin = admin.token;

  await request(app).post('/api/escolas').send({
    nome: 'Escola Rotas',
    dt_nasc: '2000-01-01',
    email: 'escola-rotas@teste.com',
    senha: 'senha123'
  });
  escola = (await login('escola-rotas@teste.com', 'senha123')).body;

  await request(app)
    .post('/api/escolas/professores')
    .set('Authorization', `Bearer ${escola.token}`)
    .send({
      nome: 'Professor Rotas',
      dt_nasc: '1985-01-01',
      email: 'prof-rotas@teste.com',
      senha: 'senha123'
    });
  professor = (await login('prof-rotas@teste.com', 'senha123')).body;

  await request(app).post('/api/alunos').send({
    nome: 'Aluno Rotas',
    dt_nasc: '2008-01-01',
    email: 'aluno-rotas@teste.com',
    senha: 'senha123'
  });
  aluno = (await login('aluno-rotas@teste.com', 'senha123')).body;
  await Aluno.update({ moedas: 100 }, { where: { id_usuario: aluno.usuario.id_usuario } });

  const atividade = await request(app)
    .post('/api/atividades')
    .set('Authorization', `Bearer ${professor.token}`)
    .send({
      nome_atividade: 'Atividade Rotas',
      pergunta: 'Pergunta inicial?',
      id_nivel_ensino: 1,
      tipo: 'multipla_escolha',
      alternativas: [
        { resposta: 'A', validade: true },
        { resposta: 'B', validade: false }
      ]
    });
  idAtividade = atividade.body.id_atividade;

  const item = await request(app)
    .post('/api/loja/itens')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ nome: 'Item Rotas', categoria: 'avatar', preco: 30 });
  idItem = item.body.id_item_loja;

  await request(app).post('/api/conquistas').set('Authorization', `Bearer ${tokenAdmin}`).send({
    nome_conquista: 'Conquista Rotas',
    tipo_requisito: 'atividades_concluidas',
    valor_requisito: 1
  });

  await request(app).post('/api/modulos').set('Authorization', `Bearer ${tokenAdmin}`).send({
    nome: 'Módulo Rotas'
  });
  const modulos = await request(app)
    .get('/api/modulos')
    .set('Authorization', `Bearer ${tokenAdmin}`);
  idModulo = modulos.body[0].id_modulo_ensino;

  await request(app)
    .post(`/api/modulos/${idModulo}/alunos`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ id_aluno: aluno.usuario.id_usuario, id_nivel_ensino: 1 });
});

test('logout encerra a sessão do cliente', async () => {
  const resposta = await request(app)
    .post('/api/auth/logout')
    .set('Authorization', `Bearer ${aluno.token}`)
    .send({});
  expect(resposta.status).toBe(200);
});

test('aluno consulta e atualiza o próprio perfil e lista alunos', async () => {
  const perfil = await request(app)
    .get('/api/alunos/me')
    .set('Authorization', `Bearer ${aluno.token}`);
  expect(perfil.status).toBe(200);
  expect(perfil.body.nome).toBe('Aluno Rotas');

  const atualizado = await request(app)
    .put('/api/alunos/me')
    .set('Authorization', `Bearer ${aluno.token}`)
    .send({ nome: 'Aluno Rotas Atualizado' });
  expect(atualizado.status).toBe(200);
  expect(atualizado.body.nome).toBe('Aluno Rotas Atualizado');

  const porId = await request(app)
    .get(`/api/alunos/${aluno.usuario.id_usuario}`)
    .set('Authorization', `Bearer ${aluno.token}`);
  expect(porId.status).toBe(200);

  const lista = await request(app)
    .get('/api/alunos')
    .set('Authorization', `Bearer ${aluno.token}`);
  expect(lista.body).toHaveLength(1);
});

test('consulta e edição de professores pela escola e pelo administrador', async () => {
  const lista = await request(app)
    .get('/api/professores')
    .set('Authorization', `Bearer ${escola.token}`);
  expect(lista.body).toHaveLength(1);

  const porId = await request(app)
    .get(`/api/professores/${professor.usuario.id_usuario}`)
    .set('Authorization', `Bearer ${escola.token}`);
  expect(porId.status).toBe(200);

  const pelaEscola = await request(app)
    .put(`/api/professores/${professor.usuario.id_usuario}`)
    .set('Authorization', `Bearer ${escola.token}`)
    .send({ nome: 'Professor Editado pela Escola' });
  expect(pelaEscola.status).toBe(200);

  const peloAdmin = await request(app)
    .put(`/api/professores/${professor.usuario.id_usuario}`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ nome: 'Professor Editado pelo Admin' });
  expect(peloAdmin.status).toBe(200);
  expect(peloAdmin.body.nome).toBe('Professor Editado pelo Admin');
});

test('lista atividades, consulta como professor e edita alternativas', async () => {
  const lista = await request(app)
    .get('/api/atividades?id_nivel_ensino=1')
    .set('Authorization', `Bearer ${aluno.token}`);
  expect(lista.status).toBe(200);
  expect(lista.body).toHaveLength(1);
  expect(lista.body[0].alternativas[0].validade).toBeUndefined();

  const comoProfessor = await request(app)
    .get(`/api/atividades/${idAtividade}`)
    .set('Authorization', `Bearer ${professor.token}`);
  expect(comoProfessor.body.alternativas[0].validade).toBe(true);

  const atualizada = await request(app)
    .put(`/api/atividades/${idAtividade}`)
    .set('Authorization', `Bearer ${professor.token}`)
    .send({
      nome_atividade: 'Atividade Rotas Editada',
      pergunta: 'Pergunta editada?',
      tipo: 'verdadeiro_falso',
      alternativas: [
        { resposta: 'Verdadeiro', validade: true },
        { resposta: 'Falso', validade: false }
      ]
    });
  expect(atualizada.status).toBe(200);
  expect(atualizada.body.nome_atividade).toBe('Atividade Rotas Editada');
  expect(atualizada.body.alternativas).toHaveLength(2);
});

test('consulta detalhe e edita item da loja', async () => {
  const detalhe = await request(app)
    .get(`/api/loja/itens/${idItem}`)
    .set('Authorization', `Bearer ${aluno.token}`);
  expect(detalhe.status).toBe(200);
  expect(detalhe.body.preco).toBe(30);

  const atualizado = await request(app)
    .put(`/api/loja/itens/${idItem}`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ nome: 'Item Rotas Editado', preco: 45 });
  expect(atualizado.status).toBe(200);
  expect(atualizado.body.preco).toBe(45);
});

test('aluno consulta módulo e lista módulos', async () => {
  const detalhe = await request(app)
    .get(`/api/modulos/${idModulo}`)
    .set('Authorization', `Bearer ${aluno.token}`);
  expect(detalhe.status).toBe(200);
  expect(detalhe.body.alunos).toHaveLength(1);

  const lista = await request(app)
    .get('/api/modulos?id_nivel_ensino=1')
    .set('Authorization', `Bearer ${aluno.token}`);
  expect(lista.body).toHaveLength(1);
});

test('consulta item inexistente retorna 404', async () => {
  const resposta = await request(app)
    .get('/api/loja/itens/9999')
    .set('Authorization', `Bearer ${aluno.token}`);
  expect(resposta.status).toBe(404);
});
