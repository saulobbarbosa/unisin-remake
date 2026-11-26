const crypto = require('crypto');
const { sequelize, LogAuditoria, Usuario } = require('../models');

const HASH_INICIAL = '0'.repeat(64);
const CAMPOS_SENSIVEIS = ['senha', 'token', 'authorization'];

let fila = Promise.resolve();

function limpar(dados) {
  if (Array.isArray(dados)) return dados.map(limpar);
  if (dados && typeof dados === 'object') {
    const resultado = {};
    for (const [chave, valor] of Object.entries(dados)) {
      if (CAMPOS_SENSIVEIS.includes(chave.toLowerCase())) continue;
      resultado[chave] = limpar(valor);
    }
    return resultado;
  }
  return dados;
}

function calcularHash(bloco) {
  const conteudo = JSON.stringify({
    data_hora: new Date(bloco.data_hora).toISOString(),
    id_usuario: bloco.id_usuario === undefined ? null : bloco.id_usuario,
    usuario_nome: bloco.usuario_nome,
    acao: bloco.acao,
    entidade: bloco.entidade,
    entidade_id: bloco.entidade_id === undefined ? null : bloco.entidade_id,
    detalhes: bloco.detalhes === undefined ? null : bloco.detalhes,
    hash_anterior: bloco.hash_anterior
  });

  return crypto.createHash('sha256').update(conteudo).digest('hex');
}

async function registrarAgora(autor, acao, entidade, entidadeId, detalhes) {
  const idUsuario = autor ? autor.id_usuario : null;
  let usuarioNome = autor ? autor.nome : null;

  if (idUsuario && !usuarioNome) {
    const usuario = await Usuario.findByPk(idUsuario);
    usuarioNome = usuario ? usuario.nome : `Usuário #${idUsuario}`;
  }
  if (!usuarioNome) usuarioNome = 'Sistema';

  return sequelize.transaction(async (transaction) => {
    const ultimo = await LogAuditoria.findOne({
      order: [['id_log', 'DESC']],
      transaction
    });

    const bloco = {
      data_hora: new Date(),
      id_usuario: idUsuario || null,
      usuario_nome: usuarioNome,
      acao,
      entidade,
      entidade_id:
        entidadeId === undefined || entidadeId === null ? null : String(entidadeId),
      detalhes: detalhes === undefined || detalhes === null
        ? null
        : JSON.stringify(limpar(detalhes)),
      hash_anterior: ultimo ? ultimo.hash_atual : HASH_INICIAL
    };
    bloco.hash_atual = calcularHash(bloco);

    const criado = await LogAuditoria.create(bloco, { transaction });
    return criado.get({ plain: true });
  });
}

function registrar(autor, acao, entidade, entidadeId, detalhes) {
  const tarefa = fila.then(() =>
    registrarAgora(autor, acao, entidade, entidadeId, detalhes)
  );
  fila = tarefa.catch(() => {});
  return tarefa;
}

function parsearDetalhes(detalhes) {
  if (!detalhes) return null;
  try {
    return JSON.parse(detalhes);
  } catch (erro) {
    return detalhes;
  }
}

async function listar() {
  const blocos = await LogAuditoria.findAll({ order: [['id_log', 'ASC']] });
  return blocos.map((bloco) => ({
    ...bloco.get({ plain: true }),
    detalhes: parsearDetalhes(bloco.detalhes)
  }));
}

async function verificar() {
  const blocos = await LogAuditoria.findAll({ order: [['id_log', 'ASC']] });
  const problemas = [];
  let hashAnterior = HASH_INICIAL;

  for (const bloco of blocos) {
    if (bloco.hash_anterior !== hashAnterior) {
      problemas.push({
        id_log: bloco.id_log,
        motivo: 'Hash anterior não corresponde ao bloco anterior'
      });
    }

    if (calcularHash(bloco) !== bloco.hash_atual) {
      problemas.push({
        id_log: bloco.id_log,
        motivo: 'Hash atual não corresponde ao conteúdo do bloco'
      });
    }

    hashAnterior = bloco.hash_atual;
  }

  return {
    integra: problemas.length === 0,
    total: blocos.length,
    problemas
  };
}

module.exports = {
  HASH_INICIAL,
  calcularHash,
  registrar,
  listar,
  verificar
};
