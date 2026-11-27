const ProfessorService = require('../services/ProfessorService');
const { registrarAuditoria } = require('../utils/auditoria');
const { responderErro } = require('../utils/erro');

async function listar(req, res) {
  try {
    const professores = await ProfessorService.listar();
    return res.json(professores);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function buscar(req, res) {
  try {
    const professor = await ProfessorService.buscarPorId(Number(req.params.id));
    return res.json(professor);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    const professor = await ProfessorService.atualizar(
      Number(req.params.id),
      req.body,
      req.usuario
    );
    const detalhes = {};
    for (const campo of ['nome', 'email', 'dt_nasc']) {
      if (req.body[campo] !== undefined) detalhes[campo] = req.body[campo];
    }
    await registrarAuditoria(
      req.usuario,
      'alteracao',
      'professor',
      professor.id_usuario,
      detalhes
    );
    return res.json(professor);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { listar, buscar, atualizar };
