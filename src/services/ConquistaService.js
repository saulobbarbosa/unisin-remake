const {
  Conquista,
  AlunoConquista,
  AlunoAtividade,
  AlunoItemLoja,
  Aluno
} = require('../models');

async function verificarConquistas(id_aluno, transaction) {
  const aluno = await Aluno.findByPk(id_aluno, { transaction });
  if (!aluno) return [];

  const conquistas = await Conquista.findAll({ where: { ativa: true }, transaction });
  if (conquistas.length === 0) return [];

  const [atividadesConcluidas, itensComprados] = await Promise.all([
    AlunoAtividade.count({ where: { id_usuario: id_aluno }, transaction }),
    AlunoItemLoja.count({ where: { aluno_id_usuario: id_aluno }, transaction })
  ]);

  const valores = {
    atividades_concluidas: atividadesConcluidas,
    vitorias_pvp: aluno.vitorias_pvp,
    itens_comprados: itensComprados,
    nivel_ensino: aluno.id_nivel_ensino || 0
  };

  const desbloqueadas = [];

  for (const conquista of conquistas) {
    if (valores[conquista.tipo_requisito] < conquista.valor_requisito) continue;

    const [, criada] = await AlunoConquista.findOrCreate({
      where: {
        aluno_id_usuario: id_aluno,
        conquista_id_conquista: conquista.id_conquista
      },
      transaction
    });

    if (criada) desbloqueadas.push(conquista);
  }

  return desbloqueadas;
}

module.exports = { verificarConquistas };
