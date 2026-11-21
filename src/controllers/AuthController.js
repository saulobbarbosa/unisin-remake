const AuthService = require('../services/AuthService');
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
    return res.status(201).json(administrador);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { login, logout, cadastrarAdministrador };
