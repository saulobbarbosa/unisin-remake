import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
    autoConnect: false,
});

let usuarioId = null;

// Registrar usuário sempre que conectar ou reconectar
socket.on("connect", () => {
    if (usuarioId) {
        socket.emit("usuario:registrar", usuarioId);
        console.log("Usuário registrado no Socket.IO:", usuarioId);
    }
});

// Conectar usuário
export const conectarSocket = (idUser) => {
    usuarioId = String(idUser);

    if (!socket.connected) {
        socket.connect();
    } else {
        socket.emit("usuario:registrar", usuarioId);
    }
};

// Desconectar usuário
export const desconectarSocket = () => {
    usuarioId = null;
    socket.disconnect();
};

export default socket;