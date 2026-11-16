const { Server } = require("socket.io");
const { randomUUID } = require("crypto");

const io = new Server(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Armazenar usuários conectados
const usuariosConectados = new Map();

// Convites pendentes
const convitesPendentes = new Map();

// Lobbies criados
const lobbies = new Map();

io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Registrar usuário
    socket.on("usuario:registrar", (userId) => {
        usuariosConectados.set(String(userId), socket.id);
        console.log("Usuário registrado:", userId);
        console.log("Usuários conectados:", [...usuariosConectados.keys()]);
    });

    // Receber convite PvP
    socket.on("pvp:convidar", (dados) => {
        const { adversarioId } = dados;
        const idUser = [...usuariosConectados.entries()].find(([id, socketId]) => socketId === socket.id)?.[0];
        const socketAdversario = usuariosConectados.get(String(adversarioId));
        if (!idUser) {
            socket.emit("pvp:erro", "Usuário não registrado.");
            return;
        }
        if (!socketAdversario) {
            socket.emit("pvp:erro", "Jogador não está conectado.");
            return;
        }
        const chaveConvite = `${idUser}:${adversarioId}`;
        convitesPendentes.set(chaveConvite, true);
        io.to(socketAdversario).emit("pvp:convite", {
            idUser,
            adversarioId: String(adversarioId)
        });
        console.log(`Convite enviado de ${idUser} para ${adversarioId}`);
    });

    // Responder convite PvP
    socket.on("pvp:responder", (dados) => {
        const { convidanteId, aceito } = dados;
        const jogadorId = [...usuariosConectados.entries()]
            .find(([id, socketId]) => socketId === socket.id)?.[0];
        if (!jogadorId) {
            socket.emit("pvp:erro", "Usuário não registrado.");
            return;
        }
        const chaveConvite = `${convidanteId}:${jogadorId}`;
        if (!convitesPendentes.has(chaveConvite)) {
            socket.emit("pvp:erro", "Convite não encontrado ou já respondido.");
            return;
        }
        convitesPendentes.delete(chaveConvite);
        const socketConvidante = usuariosConectados.get(String(convidanteId));
        if (!socketConvidante) {
            socket.emit("pvp:erro", "O jogador que enviou o convite não está conectado.");
            return;
        }
        // Informar quem enviou o convite
        io.to(socketConvidante).emit("pvp:resposta", {
            jogadorId,
            aceito
        });
        console.log(
            `Usuário ${jogadorId} ${aceito ? "aceitou" : "recusou"} o convite de ${convidanteId}`
        );
        console.log("Valor de aceito:", aceito, typeof aceito);
        console.log("Verificando criação do lobby...");
        if (!aceito) return;
        // Criar lobby
        const lobbyId = randomUUID();
        const lobby = {
            lobbyId,
            jogadores: [String(convidanteId), String(jogadorId)],
            prontos: new Set()
        };
        lobbies.set(lobbyId, lobby);
        // Colocar os dois jogadores na mesma sala
        const socketJogador = usuariosConectados.get(String(jogadorId));
        io.sockets.sockets.get(socketConvidante)?.join(lobbyId);
        io.sockets.sockets.get(socketJogador)?.join(lobbyId);
        console.log(`Lobby criado: ${lobbyId}`);
        console.log("Jogadores:", lobby.jogadores);
        // Enviar informações personalizadas para cada jogador
        io.to(socketConvidante).emit("lobby:entrar", {
            lobbyId,
            idUser: String(convidanteId),
            adversarioId: String(jogadorId)
        });
        io.to(socketJogador).emit("lobby:entrar", {
            lobbyId,
            idUser: String(jogadorId),
            adversarioId: String(convidanteId)
        });
    });

    // Atualizar estado de pronto
    socket.on("lobby:pronto", (dados) => {
        const { lobbyId, pronto } = dados;
        const jogadorId = [...usuariosConectados.entries()]
            .find(([id, socketId]) => socketId === socket.id)?.[0];
        const lobby = lobbies.get(String(lobbyId));
        if (!jogadorId || !lobby || !lobby.jogadores.includes(String(jogadorId))) {
            socket.emit("lobby:erro", "Não foi possível atualizar o estado de pronto.");
            return;
        }
        if (pronto) {
            lobby.prontos.add(String(jogadorId));
        } else {
            lobby.prontos.delete(String(jogadorId));
        }
        console.log(`Jogador ${jogadorId} está ${pronto ? "pronto" : "não pronto"}`);
        io.to(lobbyId).emit("lobby:estado", {
            prontos: [...lobby.prontos]
        });
    });

    // Reconectar jogador ao lobby
    socket.on("lobby:reentrar", (dados) => {
        const { lobbyId, idUser } = dados;
        const lobby = lobbies.get(String(lobbyId));
        if (!lobby || !lobby.jogadores.includes(String(idUser))) {
            socket.emit("lobby:erro", "Lobby não encontrado.");
            return;
        }
        socket.join(lobbyId);
        socket.emit("lobby:estado", {
            prontos: [...lobby.prontos]
        });
        console.log(`Usuário ${idUser} entrou novamente no lobby ${lobbyId}`);
    });

    // Desconectar usuário
    socket.on("disconnect", () => {
        // Remover usuário desconectado
        for (const [userId, socketId] of usuariosConectados.entries()) {
            if (socketId === socket.id) {
                usuariosConectados.delete(userId);
                console.log("Usuário desconectado:", userId);
            }
        }
        console.log("Cliente desconectado:", socket.id);
    });
});

console.log("Socket.IO rodando na porta 3001");