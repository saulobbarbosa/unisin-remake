const LojaService = require('../services/LojaService');
const { responderErro } = require('../utils/erro');

async function listarItens(req, res) {
  try {
    const itens = await LojaService.listarItens(req.usuario, req.query);
    return res.json(itens);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function buscarItem(req, res) {
  try {
    const item = await LojaService.buscarItem(Number(req.params.id), req.usuario);
    return res.json(item);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function criarItem(req, res) {
  try {
    const item = await LojaService.criarItem(req.body);
    return res.status(201).json(item);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function atualizarItem(req, res) {
  try {
    const item = await LojaService.atualizarItem(Number(req.params.id), req.body);
    return res.json(item);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function alterarStatus(req, res) {
  try {
    const item = await LojaService.alterarStatus(Number(req.params.id), req.body.ativo);
    return res.json(item);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function comprar(req, res) {
  try {
    const resultado = await LojaService.comprar(
      req.usuario.id_usuario,
      Number(req.params.id)
    );
    return res.json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function inventario(req, res) {
  try {
    const itens = await LojaService.inventario(req.usuario.id_usuario);
    return res.json(itens);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function equipados(req, res) {
  try {
    const itens = await LojaService.equipados(req.usuario.id_usuario);
    return res.json(itens);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function equipar(req, res) {
  try {
    const item = await LojaService.equipar(
      req.usuario.id_usuario,
      Number(req.params.id)
    );
    return res.json(item);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function desequipar(req, res) {
  try {
    const item = await LojaService.desequipar(
      req.usuario.id_usuario,
      Number(req.params.id)
    );
    return res.json(item);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = {
  listarItens,
  buscarItem,
  criarItem,
  atualizarItem,
  alterarStatus,
  comprar,
  inventario,
  equipados,
  equipar,
  desequipar
};
