const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ModuloEnsino = sequelize.define(
  'ModuloEnsino',
  {
    id_modulo_ensino: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(100), allowNull: false, unique: true }
  },
  { tableName: 'modulo_ensino' }
);

module.exports = ModuloEnsino;
