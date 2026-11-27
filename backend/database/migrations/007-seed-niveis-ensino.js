const { DataTypes } = require('sequelize');

async function up(queryInterface) {
  await queryInterface.bulkInsert('nivel_ensino', [
    { nome: 'Fundamental I' },
    { nome: 'Fundamental II' },
    { nome: 'Ensino Médio' }
  ]);
}

async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('nivel_ensino', {
    nome: { [Sequelize.Op.in]: ['Fundamental I', 'Fundamental II', 'Ensino Médio'] }
  });
}

module.exports = { up, down };
