const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NivelEnsino = sequelize.define(
  'NivelEnsino',
  {
    id_nivel_ensino: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(60), allowNull: false, unique: true }
  },
  { tableName: 'nivel_ensino' }
);

module.exports = NivelEnsino;
