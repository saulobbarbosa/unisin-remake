const { DataTypes } = require('sequelize');

async function up(queryInterface) {
  await queryInterface.createTable('item_loja', {
    id_item_loja: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    imagem: { type: DataTypes.STRING(500), allowNull: true },
    categoria: { type: DataTypes.STRING(45), allowNull: false },
    preco: { type: DataTypes.INTEGER, allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  });

  await queryInterface.createTable('aluno_has_item_loja', {
    aluno_id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'aluno', key: 'id_usuario' },
      onDelete: 'CASCADE'
    },
    item_loja_id_item_loja: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'item_loja', key: 'id_item_loja' },
      onDelete: 'RESTRICT'
    },
    equipado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    data_compra: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable('aluno_has_item_loja');
  await queryInterface.dropTable('item_loja');
}

module.exports = { up, down };
