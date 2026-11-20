const { DataTypes } = require('sequelize');

async function up(queryInterface) {
  await queryInterface.createTable('amigos', {
    aluno_id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'aluno', key: 'id_usuario' },
      onDelete: 'CASCADE'
    },
    amigo_id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'aluno', key: 'id_usuario' },
      onDelete: 'CASCADE'
    },
    data_amizade: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable('amigos');
}

module.exports = { up, down };
