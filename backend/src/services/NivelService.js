const { Op, fn, col } = require('sequelize');
const { AlunoModuloEnsino } = require('../models');

function arredondar(valor) {
  return Math.round(Number(valor) * 10) / 10;
}

async function nivelMedio(id_aluno, transaction) {
  const media = await AlunoModuloEnsino.aggregate('id_nivel_ensino', 'AVG', {
    where: { aluno_id_usuario: id_aluno },
    transaction
  });

  return media === null || media === undefined ? 0 : arredondar(media);
}

async function niveisMedios(ids) {
  if (ids.length === 0) return new Map();

  const linhas = await AlunoModuloEnsino.findAll({
    attributes: [
      'aluno_id_usuario',
      [fn('AVG', col('id_nivel_ensino')), 'media']
    ],
    where: { aluno_id_usuario: { [Op.in]: ids } },
    group: ['aluno_id_usuario'],
    raw: true
  });

  return new Map(
    linhas.map((linha) => [
      Number(linha.aluno_id_usuario),
      arredondar(linha.media)
    ])
  );
}

module.exports = { nivelMedio, niveisMedios };
