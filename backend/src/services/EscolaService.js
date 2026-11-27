const { Escola } = require('../models');
const { criarErro } = require('../utils/erro');

async function buscarPorId(id_escola) {
  const escola = await Escola.findByPk(id_escola);
  if (!escola) throw criarErro('Escola não encontrada', 404);
  return escola;
}

async function buscarPorUsuario(id_usuario) {
  const escola = await Escola.findOne({ where: { id_usuario } });
  if (!escola) throw criarErro('Escola não encontrada', 404);
  return escola;
}

module.exports = { buscarPorId, buscarPorUsuario };
