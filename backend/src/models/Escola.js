const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Escola = sequelize.define(
  'Escola',
  {
    id_escola: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    cep: { type: DataTypes.STRING(9), allowNull: true },
    rua: { type: DataTypes.STRING(120), allowNull: true },
    estado: { type: DataTypes.STRING(50), allowNull: true },
    cidade: { type: DataTypes.STRING(80), allowNull: true },
    numero: { type: DataTypes.STRING(15), allowNull: true }
  },
  { tableName: 'escola' }
);

module.exports = Escola;
