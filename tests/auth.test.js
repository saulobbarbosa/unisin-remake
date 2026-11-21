const request = require('supertest');
const app = require('../src/app');
const { Usuario, Administrador } = require('../src/models');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

let professorPrincipalId;

const alunoBase = {
  nome: 'Aluno Teste',
  dt_nasc: '2008-05-10',
  email: 'aluno@teste.com',
  senha: 'senha123'
};

const escolaBase = {
  nome: 'Escola Teste',
  dt_nasc: '2000-01-01',
  email: 'escola@teste.com',
  senha: 'senha123',
  cidade: 'São Paulo',
  estado: 'SP'
};

async function login(email, senha) {
  const resposta = await request(app).post('/api/auth/login').send({ email, senha });
  return resposta.body.token;
}

test('cadastra aluno, faz login e consulta o próprio perfil', async () => {
  const cadastro = await request(app).post('/api/alunos').send(alunoBase);
  expect(cadastro.status).toBe(201);
  expect(cadastro.body.tipo).toBe('aluno');
  expect(cadastro.body.senha).toBeUndefined();

  const loginResposta = await request(app)
    .post('/api/auth/login')
    .send({ email: alunoBase.email, senha: alunoBase.senha });
  expect(loginResposta.status).toBe(200);
  expect(loginResposta.body.token).toBeTruthy();
  expect(loginResposta.body.usuario.tipo).toBe('aluno');

  const perfil = await request(app)
    .get('/api/usuarios/me')
    .set('Authorization', `Bearer ${loginResposta.body.token}`);
  expect(perfil.status).toBe(200);
  expect(perfil.body.nome).toBe(alunoBase.nome);
  expect(perfil.body.moedas).toBe(0);
  expect(perfil.body.senha).toBeUndefined();
});

test('não permite e-mail duplicado nem senha incorreta', async () => {
  const duplicado = await request(app).post('/api/alunos').send(alunoBase);
  expect(duplicado.status).toBe(409);

  const senhaErrada = await request(app)
    .post('/api/auth/login')
    .send({ email: alunoBase.email, senha: 'outra' });
  expect(senhaErrada.status).toBe(401);
});

test('exige token nas rotas protegidas', async () => {
  const resposta = await request(app).get('/api/alunos');
  expect(resposta.status).toBe(401);
});

test('escola cadastra professor vinculado a ela', async () => {
  const escola = await request(app).post('/api/escolas').send(escolaBase);
  expect(escola.status).toBe(201);
  expect(escola.body.tipo).toBe('escola');

  const tokenEscola = await login(escolaBase.email, escolaBase.senha);

  const professor = await request(app)
    .post('/api/escolas/professores')
    .set('Authorization', `Bearer ${tokenEscola}`)
    .send({
      nome: 'Professor Teste',
      dt_nasc: '1985-03-20',
      email: 'professor@teste.com',
      senha: 'senha123'
    });

  expect(professor.status).toBe(201);
  expect(professor.body.id_escola).toBe(escola.body.id_escola);
  professorPrincipalId = professor.body.id_usuario;

  const tokenAluno = await login(alunoBase.email, alunoBase.senha);
  const negado = await request(app)
    .post('/api/escolas/professores')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({
      nome: 'Outro',
      dt_nasc: '1985-03-20',
      email: 'outro@teste.com',
      senha: 'senha123'
    });
  expect(negado.status).toBe(403);
});

test('professor só altera o próprio perfil', async () => {
  const escola = await request(app).post('/api/escolas').send({
    ...escolaBase,
    nome: 'Escola Dois',
    email: 'escola2@teste.com'
  });
  const tokenEscola = await login('escola2@teste.com', escolaBase.senha);

  const professorDois = await request(app)
    .post('/api/escolas/professores')
    .set('Authorization', `Bearer ${tokenEscola}`)
    .send({
      nome: 'Professor Dois',
      dt_nasc: '1980-01-01',
      email: 'professor2@teste.com',
      senha: 'senha123'
    });

  const tokenProfessor = await login('professor@teste.com', 'senha123');
  const negado = await request(app)
    .put(`/api/professores/${professorDois.body.id_usuario}`)
    .set('Authorization', `Bearer ${tokenProfessor}`)
    .send({ nome: 'Invadido' });
  expect(negado.status).toBe(403);

  const proprio = await request(app)
    .put(`/api/professores/${professorPrincipalId}`)
    .set('Authorization', `Bearer ${tokenProfessor}`)
    .send({ nome: 'Professor Atualizado' });
  expect(proprio.status).toBe(200);
  expect(proprio.body.nome).toBe('Professor Atualizado');
});

test('administrador cadastra outro administrador', async () => {
  const bcrypt = require('bcryptjs');
  const administrador = await Usuario.create({
    nome: 'Admin Root',
    dt_nasc: '1990-01-01',
    email: 'root@teste.com',
    senha: await bcrypt.hash('senha123', 10)
  });
  await Administrador.create({ id_usuario: administrador.id_usuario });

  const tokenAdmin = await login('root@teste.com', 'senha123');
  const resposta = await request(app)
    .post('/api/administradores')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      nome: 'Admin Novo',
      dt_nasc: '1991-01-01',
      email: 'novo-admin@teste.com',
      senha: 'senha123'
    });

  expect(resposta.status).toBe(201);
  expect(resposta.body.tipo).toBe('administrador');

  const tokenProfessor = await login('professor@teste.com', 'senha123');
  const negado = await request(app)
    .post('/api/administradores')
    .set('Authorization', `Bearer ${tokenProfessor}`)
    .send({
      nome: 'Admin Ilegal',
      dt_nasc: '1991-01-01',
      email: 'ilegal@teste.com',
      senha: 'senha123'
    });
  expect(negado.status).toBe(403);
});
