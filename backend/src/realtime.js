let io = null;

function definirIo(instancia) {
  io = instancia;
}

function emitirParaAluno(id_usuario, evento, dados) {
  if (!io) return;
  io.to(`aluno:${id_usuario}`).emit(evento, dados);
}

module.exports = { definirIo, emitirParaAluno };
