const { DataTypes } = require('sequelize');

async function up(queryInterface) {
  await queryInterface.createTable('conquista', {
    id_conquista: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome_conquista: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    imagem: { type: DataTypes.STRING(500), allowNull: true },
    tipo_requisito: {
      type: DataTypes.ENUM(
        'atividades_concluidas',
        'vitorias_pvp',
        'itens_comprados',
        'nivel_ensino'
      ),
      allowNull: false
    },
    valor_requisito: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    ativa: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  });

  await queryInterface.createTable('aluno_has_conquista', {
    aluno_id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'aluno', key: 'id_usuario' },
      onDelete: 'CASCADE'
    },
    conquista_id_conquista: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'conquista', key: 'id_conquista' },
      onDelete: 'CASCADE'
    },
    data_desbloqueio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable('aluno_has_conquista');
  await queryInterface.dropTable('conquista');
}

module.exports = { up, down };
