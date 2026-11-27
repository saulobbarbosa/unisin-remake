const AuthService = require('../services/AuthService');
const { registrarAuditoria } = require('../utils/auditoria');
const { responderErro } = require('../utils/erro');

async function login(req, res) {
  try {
    const resultado = await AuthService.login(req.body.email, req.body.senha);
    return res.json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function logout(req, res) {
  return res.json({ resposta: 'Logout realizado com sucesso' });
}

async function cadastrarAdministrador(req, res) {
  try {
    const administrador = await AuthService.cadastrarAdministrador(req.body);
    await registrarAuditoria(
      req.usuario,
      'inclusao',
      'usuario',
      administrador.id_usuario,
      {
        id_usuario: administrador.id_usuario,
        nome: administrador.nome,
        email: administrador.email,
        tipo: 'administrador'
      }
    );
    return res.status(201).json(administrador);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { login, logout, cadastrarAdministrador };
