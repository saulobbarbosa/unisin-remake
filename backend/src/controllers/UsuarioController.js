const UsuarioService = require('../services/UsuarioService');
const { responderErro } = require('../utils/erro');

async function me(req, res) {
  try {
    const usuario = await UsuarioService.buscarMe(req.usuario.id_usuario);
    return res.json(usuario);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { me };
