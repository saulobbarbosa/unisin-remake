const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const {
  Usuario,
  Administrador,
  Aluno,
  AlunoConquista,
  Conquista
} = require('../src/models');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

let tokenAdmin;
let tokenAluno;
let idAluno;
let idItemAvatar;
let idItemAvatar2;
let idItemMoldura;

async function login(email, senha) {
  const resposta = await request(app).post('/api/auth/login').send({ email, senha });
  return resposta.body.token;
}

beforeAll(async () => {
  const admin = await Usuario.create({
    nome: 'Admin Loja',
    dt_nasc: '1990-01-01',
    email: 'admin-loja@teste.com',
    senha: await bcrypt.hash('senha123', 4)
  });
  await Administrador.create({ id_usuario: admin.id_usuario });
  tokenAdmin = await login('admin-loja@teste.com', 'senha123');

  await request(app).post('/api/alunos').send({
    nome: 'Aluno Loja',
    dt_nasc: '2008-01-01',
    email: 'aluno-loja@teste.com',
    senha: 'senha123'
  });
  tokenAluno = await login('aluno-loja@teste.com', 'senha123');
  const aluno = await Usuario.findOne({ where: { email: 'aluno-loja@teste.com' } });
  idAluno = aluno.id_usuario;
  await Aluno.update({ moedas: 100 }, { where: { id_usuario: idAluno } });
});

async function criarItem(nome, categoria, preco) {
  const resposta = await request(app)
    .post('/api/loja/itens')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ nome, descricao: `${nome} descrição`, categoria, preco });
  return resposta;
}

test('somente administrador cadastra itens', async () => {
  const negado = await request(app)
    .post('/api/loja/itens')
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ nome: 'Ilegal', categoria: 'avatar', preco: 1 });
  expect(negado.status).toBe(403);

  const avatar = await criarItem('Avatar Azul', 'avatar', 20);
  expect(avatar.status).toBe(201);
  idItemAvatar = avatar.body.id_item_loja;

  idItemAvatar2 = (await criarItem('Avatar Verde', 'avatar', 30)).body.id_item_loja;
  idItemMoldura = (await criarItem('Moldura Ouro', 'moldura', 40)).body.id_item_loja;
});

test('compra desconta moedas, registra inventário e desbloqueia conquista', async () => {
  await Conquista.create({
    nome_conquista: 'Primeira compra',
    tipo_requisito: 'itens_comprados',
    valor_requisito: 1
  });

  const compra = await request(app)
    .post(`/api/loja/comprar/${idItemAvatar}`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({ preco: 0 });

  expect(compra.status).toBe(200);
  expect(compra.body.moedas).toBe(80);

  const aluno = await Aluno.findByPk(idAluno);
  expect(aluno.moedas).toBe(80);

  const inventario = await request(app)
    .get('/api/loja/inventario')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(inventario.body).toHaveLength(1);
  expect(inventario.body[0].id_item_loja).toBe(idItemAvatar);
  expect(inventario.body[0].equipado).toBe(false);

  const conquistas = await AlunoConquista.count({ where: { aluno_id_usuario: idAluno } });
  expect(conquistas).toBe(1);
});

test('impede compra duplicada e saldo insuficiente', async () => {
  const duplicada = await request(app)
    .post(`/api/loja/comprar/${idItemAvatar}`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});
  expect(duplicada.status).toBe(409);

  const caro = await criarItem('Item Caro', 'acessorio', 999);
  const semSaldo = await request(app)
    .post(`/api/loja/comprar/${caro.body.id_item_loja}`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});
  expect(semSaldo.status).toBe(400);

  const aluno = await Aluno.findByPk(idAluno);
  expect(aluno.moedas).toBe(80);
});

test('equipar item da mesma categoria desequipa o anterior', async () => {
  await request(app)
    .post(`/api/loja/comprar/${idItemAvatar2}`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});

  const primeiro = await request(app)
    .post(`/api/loja/equipar/${idItemAvatar}`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});
  expect(primeiro.status).toBe(200);

  const segundo = await request(app)
    .post(`/api/loja/equipar/${idItemAvatar2}`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});
  expect(segundo.status).toBe(200);

  const inventario = await request(app)
    .get('/api/loja/inventario')
    .set('Authorization', `Bearer ${tokenAluno}`);

  const avatarAzul = inventario.body.find((item) => item.id_item_loja === idItemAvatar);
  const avatarVerde = inventario.body.find((item) => item.id_item_loja === idItemAvatar2);
  expect(avatarAzul.equipado).toBe(false);
  expect(avatarVerde.equipado).toBe(true);

  const equipados = await request(app)
    .get('/api/loja/equipados')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(equipados.body).toHaveLength(1);
  expect(equipados.body[0].id_item_loja).toBe(idItemAvatar2);
});

test('não equipa item não adquirido e permite desequipar', async () => {
  const naoAdquirido = await request(app)
    .post(`/api/loja/equipar/${idItemMoldura}`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});
  expect(naoAdquirido.status).toBe(403);

  const desequipado = await request(app)
    .post(`/api/loja/desequipar/${idItemAvatar2}`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});
  expect(desequipado.status).toBe(200);

  const equipados = await request(app)
    .get('/api/loja/equipados')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(equipados.body).toHaveLength(0);
});

test('item inativo não aparece nem pode ser comprado', async () => {
  await request(app)
    .patch(`/api/loja/itens/${idItemMoldura}/status`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ ativo: false });

  const lista = await request(app)
    .get('/api/loja/itens')
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(lista.body.some((item) => item.id_item_loja === idItemMoldura)).toBe(false);

  const alvo = await request(app)
    .get(`/api/loja/itens/${idItemMoldura}`)
    .set('Authorization', `Bearer ${tokenAluno}`);
  expect(alvo.status).toBe(404);

  const compra = await request(app)
    .post(`/api/loja/comprar/${idItemMoldura}`)
    .set('Authorization', `Bearer ${tokenAluno}`)
    .send({});
  expect(compra.status).toBe(400);
});
