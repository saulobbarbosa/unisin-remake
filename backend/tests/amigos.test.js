const request = require('supertest');
const app = require('../src/app');
const { Aluno, ItemLoja, AlunoItemLoja } = require('../src/models');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

let alunoA;
let alunoB;
let alunoC;

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
  alunoA = await criarAluno('João Silva', 'joao@amigos.com');
  alunoB = await criarAluno('Maria Souza', 'maria@amigos.com');
  alunoC = await criarAluno('Pedro Lima', 'pedro@amigos.com');
});

test('busca alunos por nome sem incluir a si mesmo', async () => {
  const resposta = await request(app)
    .get('/api/amigos/buscar?nome=Maria')
    .set('Authorization', `Bearer ${alunoA.token}`);

  expect(resposta.status).toBe(200);
  expect(resposta.body).toHaveLength(1);
  expect(resposta.body[0].id_usuario).toBe(alunoB.usuario.id_usuario);

  const propria = await request(app)
    .get('/api/amigos/buscar?nome=João')
    .set('Authorization', `Bearer ${alunoA.token}`);
  expect(propria.body).toHaveLength(0);
});

test('não permite adicionar a si mesmo', async () => {
  const resposta = await request(app)
    .post('/api/amigos')
    .set('Authorization', `Bearer ${alunoA.token}`)
    .send({ id_amigo: alunoA.usuario.id_usuario });

  expect(resposta.status).toBe(400);
});

test('adiciona amizade recíproca e bloqueia duplicidade', async () => {
  const resposta = await request(app)
    .post('/api/amigos')
    .set('Authorization', `Bearer ${alunoA.token}`)
    .send({ id_amigo: alunoB.usuario.id_usuario });

  expect(resposta.status).toBe(201);
  expect(resposta.body.nome).toBe('Maria Souza');

  const listaA = await request(app)
    .get('/api/amigos')
    .set('Authorization', `Bearer ${alunoA.token}`);
  expect(listaA.body).toHaveLength(1);

  const listaB = await request(app)
    .get('/api/amigos')
    .set('Authorization', `Bearer ${alunoB.token}`);
  expect(listaB.body).toHaveLength(1);
  expect(listaB.body[0].id_usuario).toBe(alunoA.usuario.id_usuario);

  const duplicada = await request(app)
    .post('/api/amigos')
    .set('Authorization', `Bearer ${alunoA.token}`)
    .send({ id_amigo: alunoB.usuario.id_usuario });
  expect(duplicada.status).toBe(409);
});

test('lista somente id, nome, nível, moedas, borda e avatar', async () => {
  await Aluno.update(
    { moedas: 77, id_nivel_ensino: 2 },
    { where: { id_usuario: alunoB.usuario.id_usuario } }
  );

  const avatar = await ItemLoja.create({
    nome: 'Avatar Verde',
    categoria: 'avatar',
    preco: 0,
    valor: '/itens/avatar-verde.png'
  });
  const borda = await ItemLoja.create({
    nome: 'Borda Ouro',
    categoria: 'borda',
    preco: 0,
    valor: '#FFD700'
  });
  await AlunoItemLoja.bulkCreate([
    {
      aluno_id_usuario: alunoB.usuario.id_usuario,
      item_loja_id_item_loja: avatar.id_item_loja,
      equipado: true
    },
    {
      aluno_id_usuario: alunoB.usuario.id_usuario,
      item_loja_id_item_loja: borda.id_item_loja,
      equipado: true
    }
  ]);

  const lista = await request(app)
    .get('/api/amigos')
    .set('Authorization', `Bearer ${alunoA.token}`);

  expect(lista.status).toBe(200);
  expect(lista.body).toEqual([
    {
      id_usuario: alunoB.usuario.id_usuario,
      nome: 'Maria Souza',
      nivel_ensino: { id_nivel_ensino: 2, nome: 'Fundamental II' },
      moedas: 77,
      borda: '#FFD700',
      avatar: '/itens/avatar-verde.png'
    }
  ]);
});

test('remove amizade nos dois sentidos', async () => {
  const resposta = await request(app)
    .delete(`/api/amigos/${alunoB.usuario.id_usuario}`)
    .set('Authorization', `Bearer ${alunoA.token}`);
  expect(resposta.status).toBe(200);

  const listaB = await request(app)
    .get('/api/amigos')
    .set('Authorization', `Bearer ${alunoB.token}`);
  expect(listaB.body).toHaveLength(0);

  const inexistente = await request(app)
    .delete(`/api/amigos/${alunoB.usuario.id_usuario}`)
    .set('Authorization', `Bearer ${alunoA.token}`);
  expect(inexistente.status).toBe(404);
});
