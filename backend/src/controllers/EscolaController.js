const AuthService = require('../services/AuthService');
const AlunoService = require('../services/AlunoService');
const { registrarAuditoria } = require('../utils/auditoria');
const { responderErro } = require('../utils/erro');

async function criar(req, res) {
  try {
    const escola = await AuthService.cadastrarEscola(req.body);
    await registrarAuditoria(
      { id_usuario: escola.id_usuario, nome: escola.nome },
      'inclusao',
      'escola',
      escola.id_escola,
      {
        id_usuario: escola.id_usuario,
        id_escola: escola.id_escola,
        nome: escola.nome,
        email: escola.email
      }
    );
    return res.status(201).json(escola);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function criarProfessor(req, res) {
  try {
    const escola = await AlunoService.escolaDoUsuario(req.usuario.id_usuario);
    const professor = await AuthService.cadastrarProfessor(escola.id_escola, req.body);
    await registrarAuditoria(
      req.usuario,
      'inclusao',
      'professor',
      professor.id_usuario,
      {
        id_usuario: professor.id_usuario,
        nome: professor.nome,
        email: professor.email,
        id_escola: professor.id_escola
      }
    );
    return res.status(201).json(professor);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { criar, criarProfessor };
