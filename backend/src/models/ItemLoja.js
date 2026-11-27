const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemLoja = sequelize.define(
  'ItemLoja',
  {
    id_item_loja: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    imagem: { type: DataTypes.STRING(500), allowNull: true },
    categoria: { type: DataTypes.STRING(45), allowNull: false },
    preco: { type: DataTypes.INTEGER, allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { tableName: 'item_loja' }
);

module.exports = ItemLoja;
