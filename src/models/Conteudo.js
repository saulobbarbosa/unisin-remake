const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conteudo = sequelize.define(
  'Conteudo',
  {
    id_conteudo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_atividade: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.STRING(30), allowNull: true },
    caminho: { type: DataTypes.STRING(500), allowNull: false }
  },
  { tableName: 'conteudo' }
);

module.exports = Conteudo;
