const path = require('path');
const fs = require('fs');
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');

const Meta = sequelize.define(
  'SequelizeMeta',
  { name: { type: DataTypes.STRING(255), primaryKey: true } },
  { tableName: 'SequelizeMeta', timestamps: false }
);

async function migrar() {
  await Meta.sync();

  const diretorio = path.join(__dirname, 'migrations');
  const arquivos = fs
    .readdirSync(diretorio)
    .filter((arquivo) => arquivo.endsWith('.js'))
    .sort();

  for (const arquivo of arquivos) {
    const aplicada = await Meta.findByPk(arquivo);
    if (aplicada) continue;

    const migration = require(path.join(diretorio, arquivo));
    const queryInterface = sequelize.getQueryInterface();
    await migration.up(queryInterface, DataTypes);
    await Meta.create({ name: arquivo });
    console.log(`Migration aplicada: ${arquivo}`);
  }
}

module.exports = { migrar, Meta };

if (require.main === module) {
  migrar()
    .then(() => sequelize.close())
    .then(() => console.log('Migrations concluídas.'))
    .catch((erro) => {
      console.error('Falha nas migrations:', erro.message);
      process.exitCode = 1;
    });
}
