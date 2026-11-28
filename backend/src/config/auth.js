require('./env');

module.exports = {
  secret: process.env.JWT_SECRET || 'dev-secret-mude-em-producao',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d'
};
