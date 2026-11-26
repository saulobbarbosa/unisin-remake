const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LogAuditoria = sequelize.define(
  'LogAuditoria',
  {
    id_log: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    data_hora: { type: DataTypes.DATE(3), allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: true },
    usuario_nome: { type: DataTypes.STRING(150), allowNull: false },
    acao: { type: DataTypes.STRING(20), allowNull: false },
    entidade: { type: DataTypes.STRING(20), allowNull: false },
    entidade_id: { type: DataTypes.STRING(50), allowNull: true },
    detalhes: { type: DataTypes.TEXT, allowNull: true },
    hash_anterior: { type: DataTypes.STRING(64), allowNull: false },
    hash_atual: { type: DataTypes.STRING(64), allowNull: false }
  },
  { tableName: 'log_auditoria' }
);

module.exports = LogAuditoria;
