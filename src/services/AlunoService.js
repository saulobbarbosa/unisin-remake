const { Usuario, Aluno, Escola, NivelEnsino } = require('../models');
const { criarErro } = require('../utils/erro');

function formatar(aluno) {
  return {
    id_usuario: aluno.id_usuario,
    nome: aluno.usuario.nome,
    email: aluno.usuario.email,
    moedas: aluno.moedas,
    vitorias_pvp: aluno.vitorias_pvp,
    nivel_ensino: aluno.nivelEnsino
      ? { id_nivel_ensino: aluno.nivelEnsino.id_nivel_ensino, nome: aluno.nivelEnsino.nome }
      : null
  };
}

const incluir = [
  { model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nome', 'email'] },
  { model: NivelEnsino, as: 'nivelEnsino' }
];

async function listar() {
  const alunos = await Aluno.findAll({ include: incluir, order: [['id_usuario', 'ASC']] });
  return alunos.map(formatar);
}

async function buscarPorId(id_usuario) {
  const aluno = await Aluno.findByPk(id_usuario, { include: incluir });
  if (!aluno) throw criarErro('Aluno não encontrado', 404);
  return formatar(aluno);
}

async function atualizarMe(id_usuario, dados) {
  const aluno = await Aluno.findByPk(id_usuario, { include: incluir });
  if (!aluno) throw criarErro('Aluno não encontrado', 404);

  const alteracoes = {};
  for (const campo of ['nome', 'dt_nasc', 'email']) {
    if (dados[campo] !== undefined) alteracoes[campo] = dados[campo];
  }

  if (alteracoes.email && alteracoes.email !== aluno.usuario.email) {
    const existente = await Usuario.findOne({ where: { email: alteracoes.email } });
    if (existente) throw criarErro('E-mail já cadastrado', 409);
  }

  if (Object.keys(alteracoes).length > 0) {
    await Usuario.update(alteracoes, { where: { id_usuario } });
  }

  return buscarPorId(id_usuario);
}

async function escolaDoUsuario(id_usuario) {
  const escola = await Escola.findOne({ where: { id_usuario } });
  if (!escola) throw criarErro('Escola não encontrada', 404);
  return escola;
}

module.exports = { listar, buscarPorId, atualizarMe, escolaDoUsuario };
