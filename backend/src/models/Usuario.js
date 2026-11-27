const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define(
  'Usuario',
  {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    dt_nasc: { type: DataTypes.DATEONLY, allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    senha: { type: DataTypes.STRING(255), allowNull: false }
  },
  {
    tableName: 'usuario',
    defaultScope: { attributes: { exclude: ['senha'] } },
    scopes: { comSenha: { attributes: { include: ['senha'] } } }
  }
);

module.exports = Usuario;
