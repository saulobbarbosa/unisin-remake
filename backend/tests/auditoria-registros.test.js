const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Usuario, Administrador, Aluno } = require('../src/models');
const AuditoriaService = require('../src/services/AuditoriaService');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

let registros;

beforeAll(async () => {
  const admin = await Usuario.create({
    nome: 'Admin Auditoria',
    dt_nasc: '1990-01-01',
    email: 'admin-auditoria@teste.com',
    senha: await bcrypt.hash('senha123', 4)
  });
  await Administrador.create({ id_usuario: admin.id_usuario });
  const tokenAdmin = (
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin-auditoria@teste.com', senha: 'senha123' })
  ).body.token;

  await request(app)
    .post('/api/administradores')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      nome: 'Admin Dois',
      dt_nasc: '1990-01-01',
      email: 'admin2@teste.com',
      senha: 'senha123'
    });

  await request(app).post('/api/escolas').send({
    nome: 'Escola Auditoria',
    dt_nasc: '2000-01-01',
    email: 'escola-auditoria@teste.com',
    senha: 'senha123'
  });
  const tokenEscola = (
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'escola-auditoria@teste.com', senha: 'senha123' })
  ).body.token;

  await request(app)
    .post('/api/escolas/professores')
    .set('Authorization', `Bearer ${tokenEscola}`)
    .send({
      nome: 'Professor Auditoria',
      dt_nasc: '1985-01-01',
      email: 'prof-auditoria@teste.com',
      senha: 'senha123'
    });
  const loginProfessor = (
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'prof-auditoria@teste.com', senha: 'senha123' })
  ).body;

  await request(app).post('/api/alunos').send({
    nome: 'Aluno Auditoria',
    dt_nasc: '2008-01-01',
    email: 'aluno-auditoria@teste.com',
    senha: 'senha123'
  });
  const loginAluno = (
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'aluno-auditoria@teste.com', senha: 'senha123' })
  ).body;

  await request(app)
    .put('/api/alunos/me')
    .set('Authorization', `Bearer ${loginAluno.token}`)
    .send({ nome: 'Aluno Editado' });

  await request(app)
    .put(`/api/professores/${loginProfessor.usuario.id_usuario}`)
    .set('Authorization', `Bearer ${tokenEscola}`)
    .send({ nome: 'Professor Editado' });

  const atividade = await request(app)
    .post('/api/atividades')
    .set('Authorization', `Bearer ${loginProfessor.token}`)
    .send({
      nome_atividade: 'Atividade Auditoria',
      pergunta: 'Pergunta?',
      id_nivel_ensino: 1,
      tipo: 'multipla_escolha',
      alternativas: [
        { resposta: 'A', validade: true },
        { resposta: 'B', validade: false }
      ]
    });

  await request(app)
    .put(`/api/atividades/${atividade.body.id_atividade}`)
    .set('Authorization', `Bearer ${loginProfessor.token}`)
    .send({ nome_atividade: 'Atividade Editada' });

  await request(app)
    .patch(`/api/atividades/${atividade.body.id_atividade}/status`)
    .set('Authorization', `Bearer ${loginProfessor.token}`)
    .send({ ativo: false });

  const item = await request(app)
    .post('/api/loja/itens')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ nome: 'Item Auditoria', categoria: 'avatar', preco: 10 });
  await Aluno.update(
    { moedas: 50 },
    { where: { id_usuario: loginAluno.usuario.id_usuario } }
  );
  await request(app)
    .post(`/api/loja/comprar/${item.body.id_item_loja}`)
    .set('Authorization', `Bearer ${loginAluno.token}`)
    .send({});

  registros = await AuditoriaService.listar();
});

test('registra as cinco áreas com ator e cadeia íntegra', async () => {
  const resumo = registros.map((registro) => `${registro.entidade}:${registro.acao}`);

  expect(resumo).toEqual(
    expect.arrayContaining([
      'usuario:inclusao',
      'usuario:alteracao',
      'escola:inclusao',
      'professor:inclusao',
      'professor:alteracao',
      'atividade:inclusao',
      'atividade:alteracao',
      'atividade:exclusao',
      'compra:compra'
    ])
  );

  expect(JSON.stringify(registros)).not.toContain('senha123');

  const compra = registros.find((registro) => registro.entidade === 'compra');
  expect(compra.usuario_nome).toBe('Aluno Editado');
  expect(compra.detalhes).toMatchObject({ preco: 10, moedas: 40 });

  expect((await AuditoriaService.verificar()).integra).toBe(true);
});
