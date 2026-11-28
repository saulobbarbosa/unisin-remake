async function renomear(queryInterface, de, para) {
  if (queryInterface.sequelize.getDialect() === 'sqlite') {
    await queryInterface.sequelize.query(
      `ALTER TABLE item_loja RENAME COLUMN ${de} TO ${para}`
    );
    return;
  }

  await queryInterface.renameColumn('item_loja', de, para);
}

async function up(queryInterface) {
  await renomear(queryInterface, 'imagem', 'valor');
}

async function down(queryInterface) {
  await renomear(queryInterface, 'valor', 'imagem');
}

module.exports = { up, down };
