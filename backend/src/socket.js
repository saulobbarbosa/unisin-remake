const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const authConfig = require('./config/auth');
const realtime = require('./realtime');
const PvpService = require('./services/PvpService');

function configurarSocket(servidorHttp) {
  const io = new Server(servidorHttp, {
    cors: { origin: '*' }
  });

  realtime.definirIo(io);

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      const usuario = jwt.verify(token, authConfig.secret);
      if (usuario.tipo !== 'aluno') {
        return next(new Error('Apenas alunos podem jogar PvP'));
      }
      socket.usuario = usuario;
      return next();
    } catch (erro) {
      return next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`aluno:${socket.usuario.id_usuario}`);
    socket.emit('pvp:conectado', { id_usuario: socket.usuario.id_usuario });

    socket.on('pvp:responder', async (dados, callback) => {
      try {
        const resultado = await PvpService.responder(socket.usuario.id_usuario, dados);
        if (typeof callback === 'function') callback({ ok: true, ...resultado });
      } catch (erro) {
        if (typeof callback === 'function') {
          callback({ ok: false, erro: erro.message });
        }
      }
    });
  });

  return io;
}

module.exports = { configurarSocket };
