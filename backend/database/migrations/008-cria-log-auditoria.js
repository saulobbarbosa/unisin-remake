const { DataTypes } = require('sequelize');

async function up(queryInterface) {
  await queryInterface.createTable('log_auditoria', {
    id_log: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    data_hora: { type: DataTypes.DATE(3), allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: true },
    usuario_nome: { type: DataTypes.STRING(150), allowNull: false },
    acao: { type: DataTypes.STRING(20), allowNull: false },
    entidade: { type: DataTypes.STRING(20), allowNull: false },
    entidade_id: { type: DataTypes.STRING(50), allowNull: true },
    detalhes: { type: DataTypes.TEXT, allowNull: true },
    hash_anterior: { type: DataTypes.STRING(64), allowNull: false },
    hash_atual: { type: DataTypes.STRING(64), allowNull: false }
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable('log_auditoria');
}

module.exports = { up, down };
