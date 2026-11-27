const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Administrador } = require('../src/models');

async function semear() {
  const email = process.env.ADMIN_EMAIL || 'admin@unisin.com';
  const senha = process.env.ADMIN_SENHA || 'admin123';

  let usuario = await Usuario.scope('comSenha').findOne({ where: { email } });

  if (!usuario) {
    usuario = await Usuario.create({
      nome: process.env.ADMIN_NOME || 'Administrador',
      dt_nasc: process.env.ADMIN_DT_NASC || '1990-01-01',
      email,
      senha: await bcrypt.hash(senha, 10)
    });
    console.log(`Administrador criado: ${email}`);
  }

  const administrador = await Administrador.findByPk(usuario.id_usuario);
  if (!administrador) {
    await Administrador.create({ id_usuario: usuario.id_usuario });
    console.log('Perfil de administrador criado.');
  }
}

module.exports = { semear };

if (require.main === module) {
  semear()
    .then(() => sequelize.close())
    .then(() => console.log('Seed concluído.'))
    .catch((erro) => {
      console.error('Falha no seed:', erro.message);
      process.exitCode = 1;
    });
}
