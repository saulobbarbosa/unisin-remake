const AuthService = require('../services/AuthService');
const AlunoService = require('../services/AlunoService');
const { responderErro } = require('../utils/erro');

async function criar(req, res) {
  try {
    const escola = await AuthService.cadastrarEscola(req.body);
    return res.status(201).json(escola);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function criarProfessor(req, res) {
  try {
    const escola = await AlunoService.escolaDoUsuario(req.usuario.id_usuario);
    const professor = await AuthService.cadastrarProfessor(escola.id_escola, req.body);
    return res.status(201).json(professor);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { criar, criarProfessor };
