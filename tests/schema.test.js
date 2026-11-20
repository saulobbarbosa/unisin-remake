const { NivelEnsino, Usuario, Aluno, Amigos } = require('../src/models');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

async function criarAluno(email) {
  const usuario = await Usuario.create({
    nome: email,
    dt_nasc: '2005-01-01',
    email,
    senha: 'hash'
  });
  await Aluno.create({ id_usuario: usuario.id_usuario });
  return usuario;
}

test('migrations criam os níveis de ensino iniciais', async () => {
  const niveis = await NivelEnsino.findAll({ order: [['id_nivel_ensino', 'ASC']] });
  expect(niveis.map((nivel) => nivel.nome)).toEqual([
    'Fundamental I',
    'Fundamental II',
    'Ensino Médio'
  ]);
});

test('e-mail de usuário é único', async () => {
  await criarAluno('unico@teste.com');
  await expect(criarAluno('unico@teste.com')).rejects.toThrow();
});

test('amizade duplicada é bloqueada pela chave composta', async () => {
  const primeiro = await criarAluno('amigo1@teste.com');
  const segundo = await criarAluno('amigo2@teste.com');

  await Amigos.create({
    aluno_id_usuario: primeiro.id_usuario,
    amigo_id_usuario: segundo.id_usuario
  });

  await expect(
    Amigos.create({
      aluno_id_usuario: primeiro.id_usuario,
      amigo_id_usuario: segundo.id_usuario
    })
  ).rejects.toThrow();
});
