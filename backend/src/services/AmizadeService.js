const { Op } = require('sequelize');
const { sequelize, Amigos, Aluno, Usuario } = require('../models');
const { criarErro } = require('../utils/erro');

const incluirAmigo = [
  {
    model: Aluno,
    as: 'amigo',
    include: [
      { model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nome', 'email'] }
    ]
  }
];

function formatar(relacao) {
  return {
    id_usuario: relacao.amigo_id_usuario,
    nome: relacao.amigo.usuario.nome,
    email: relacao.amigo.usuario.email,
    data_amizade: relacao.data_amizade
  };
}

async function listar(id_aluno) {
  const relacoes = await Amigos.findAll({
    where: { aluno_id_usuario: id_aluno },
    include: incluirAmigo,
    order: [['data_amizade', 'ASC']]
  });
  return relacoes.map(formatar);
}

async function buscar(id_aluno, termo) {
  if (!termo) throw criarErro('Informe o nome ou e-mail para busca');

  const alunos = await Aluno.findAll({
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id_usuario', 'nome', 'email'],
        where: {
          [Op.or]: [
            { nome: { [Op.like]: `%${termo}%` } },
            { email: { [Op.like]: `%${termo}%` } }
          ]
        }
      }
    ],
    limit: 20
  });

  return alunos
    .filter((aluno) => aluno.id_usuario !== id_aluno)
    .map((aluno) => ({
      id_usuario: aluno.id_usuario,
      nome: aluno.usuario.nome,
      email: aluno.usuario.email
    }));
}

async function adicionar(id_aluno, id_amigo) {
  if (!id_amigo) throw criarErro('Campo obrigatório: id_amigo');
  id_amigo = Number(id_amigo);

  if (id_amigo === id_aluno) {
    throw criarErro('Não é possível adicionar a si mesmo');
  }

  const amigo = await Aluno.findByPk(id_amigo);
  if (!amigo) throw criarErro('Aluno não encontrado', 404);

  const resultado = await sequelize.transaction(async (transaction) => {
    const [, criadaIda] = await Amigos.findOrCreate({
      where: { aluno_id_usuario: id_aluno, amigo_id_usuario: id_amigo },
      transaction
    });
    const [, criadaVolta] = await Amigos.findOrCreate({
      where: { aluno_id_usuario: id_amigo, amigo_id_usuario: id_aluno },
      transaction
    });

    return criadaIda || criadaVolta;
  });

  if (!resultado) throw criarErro('Amizade já existe', 409);

  const usuario = await Usuario.findByPk(id_amigo, {
    attributes: ['id_usuario', 'nome', 'email']
  });

  return {
    id_usuario: id_amigo,
    nome: usuario.nome,
    email: usuario.email
  };
}

async function remover(id_aluno, id_amigo) {
  const removidas = await Amigos.destroy({
    where: {
      [Op.or]: [
        { aluno_id_usuario: id_aluno, amigo_id_usuario: Number(id_amigo) },
        { aluno_id_usuario: Number(id_amigo), amigo_id_usuario: id_aluno }
      ]
    }
  });

  if (removidas === 0) throw criarErro('Amizade não encontrada', 404);
  return { resposta: 'Amizade removida com sucesso' };
}

async function saoAmigos(id_aluno, id_amigo) {
  const relacao = await Amigos.findOne({
    where: { aluno_id_usuario: id_aluno, amigo_id_usuario: id_amigo }
  });
  return Boolean(relacao);
}

module.exports = { listar, buscar, adicionar, remover, saoAmigos };
