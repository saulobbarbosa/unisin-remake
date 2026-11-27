const AuditoriaService = require('../services/AuditoriaService');

async function registrarAuditoria(autor, acao, entidade, entidadeId, detalhes) {
  try {
    await AuditoriaService.registrar(autor, acao, entidade, entidadeId, detalhes);
  } catch (erro) {
    console.error('Falha ao registrar auditoria:', erro.message);
  }
}

module.exports = { registrarAuditoria };
