const { sequelize, LogAuditoria } = require('../src/models');

async function main() {
  const id = Number(process.argv[2]);

  if (!Number.isInteger(id) || id < 1) {
    console.error('Uso: npm run auditoria:adulterar -- <id_log>');
    process.exitCode = 1;
    return;
  }

  const bloco = await LogAuditoria.findByPk(id);
  if (!bloco) {
    console.error(`Bloco #${id} não encontrado.`);
    process.exitCode = 1;
    return;
  }

  const anterior = bloco.detalhes;
  const adulterado = anterior ? `${anterior} [ADULTERADO]` : '[ADULTERADO]';

  await bloco.update({ detalhes: adulterado });

  console.log(`Bloco #${id} adulterado.`);
  console.log(`Detalhes antes: ${anterior || '(vazio)'}`);
  console.log(`Detalhes depois: ${adulterado}`);
  console.log(`Hash anterior: ${bloco.hash_anterior}`);
  console.log(`Hash atual (mantido, não recalculado): ${bloco.hash_atual}`);
  console.log('Abra /auditoria e clique em "Verificar integridade" para ver o bloco inválido.');
}

main()
  .catch((erro) => {
    console.error('Falha ao adulterar auditoria:', erro.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
