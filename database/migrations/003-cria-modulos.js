const { DataTypes } = require('sequelize');

async function up(queryInterface) {
  await queryInterface.createTable('modulo_ensino', {
    id_modulo_ensino: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(100), allowNull: false, unique: true }
  });

  await queryInterface.createTable('aluno_has_modulo_ensino', {
    id_modulo_ensino: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'modulo_ensino', key: 'id_modulo_ensino' },
      onDelete: 'CASCADE'
    },
    id_nivel_ensino: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'nivel_ensino', key: 'id_nivel_ensino' },
      onDelete: 'CASCADE'
    },
    aluno_id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'aluno', key: 'id_usuario' },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('nao_iniciado', 'em_andamento', 'concluido'),
      allowNull: false,
      defaultValue: 'nao_iniciado'
    },
    data_conclusao: { type: DataTypes.DATE, allowNull: true }
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable('aluno_has_modulo_ensino');
  await queryInterface.dropTable('modulo_ensino');
}

module.exports = { up, down };
