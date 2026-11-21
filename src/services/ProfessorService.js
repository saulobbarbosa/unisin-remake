const { Usuario, Professor, Escola } = require('../models');
const { criarErro } = require('../utils/erro');

function formatar(professor) {
  return {
    id_usuario: professor.id_usuario,
    nome: professor.usuario.nome,
    email: professor.usuario.email,
    dt_nasc: professor.usuario.dt_nasc,
    id_escola: professor.id_escola,
    escola: professor.escola ? { id_escola: professor.escola.id_escola, nome: professor.escola.nome } : null
  };
}

const incluir = [
  { model: Usuario, as: 'usuario' },
  { model: Escola, as: 'escola' }
];

async function listar() {
  const professores = await Professor.findAll({
    include: incluir,
    order: [['id_usuario', 'ASC']]
  });
  return professores.map(formatar);
}

async function buscarPorId(id_usuario) {
  const professor = await Professor.findByPk(id_usuario, { include: incluir });
  if (!professor) throw criarErro('Professor não encontrado', 404);
  return formatar(professor);
}

async function atualizar(id_usuario, dados, solicitante) {
  const professor = await Professor.findByPk(id_usuario);
  if (!professor) throw criarErro('Professor não encontrado', 404);

  if (solicitante.tipo === 'professor' && solicitante.id_usuario !== id_usuario) {
    throw criarErro('Professor só pode alterar o próprio perfil', 403);
  }

  if (solicitante.tipo === 'escola') {
    const escola = await Escola.findOne({ where: { id_usuario: solicitante.id_usuario } });
    if (!escola || escola.id_escola !== professor.id_escola) {
      throw criarErro('Professor não pertence à escola', 403);
    }
  }

  const alteracoes = {};
  for (const campo of ['nome', 'dt_nasc', 'email']) {
    if (dados[campo] !== undefined) alteracoes[campo] = dados[campo];
  }

  if (alteracoes.email) {
    const existente = await Usuario.findOne({ where: { email: alteracoes.email } });
    if (existente && existente.id_usuario !== id_usuario) {
      throw criarErro('E-mail já cadastrado', 409);
    }
  }

  if (Object.keys(alteracoes).length > 0) {
    await Usuario.update(alteracoes, { where: { id_usuario } });
  }

  return buscarPorId(id_usuario);
}

module.exports = { listar, buscarPorId, atualizar };
