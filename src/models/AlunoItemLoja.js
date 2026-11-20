const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlunoItemLoja = sequelize.define(
  'AlunoItemLoja',
  {
    aluno_id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
    item_loja_id_item_loja: { type: DataTypes.INTEGER, primaryKey: true },
    equipado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    data_compra: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { tableName: 'aluno_has_item_loja' }
);

module.exports = AlunoItemLoja;
