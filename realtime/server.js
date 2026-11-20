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
// Partida Pvp em andamento
const partidas = new Map();

// Carregar perguntas do JSON
const carregarPerguntas = async () => {
    try {
        const response = await fetch("http://localhost:3000/dadosJson/pvp.json");
        if (!response.ok) {
            throw new Error("Não foi possível carregar o arquivo de perguntas.");
        }
        const perguntas = await response.json();
        // Sortear perguntas
        return [...perguntas].sort(() => Math.random() - 0.5).slice(0, 5);
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        return [];
    }
};

io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Funções Padrões
    // Registrar usuário
    socket.on("usuario:registrar", (userId) => {
        usuariosConectados.set(String(userId), socket.id);
        console.log("Usuário registrado:", userId);
        console.log("Usuários conectados:", [...usuariosConectados.keys()]);
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

    // Funções para Fazer o Lobby Funcionar
    // Receber convite PvP
    socket.on("convite:convidar", (dados) => {
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
    socket.on("convite:responder", (dados) => {
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
            prontos: new Set(),
            contagemIniciada: false
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
        // Impedir alterações quando a contagem já começou
        if (lobby.contagemIniciada) {
            socket.emit("lobby:erro", "A partida já está começando.");
            return;
        }
        if (pronto) {
            lobby.prontos.add(String(jogadorId))
        } else {
            lobby.prontos.delete(String(jogadorId))
        }
        console.log(`Jogador ${jogadorId} está ${pronto ? "pronto" : "não pronto"}`);
        io.to(lobbyId).emit("lobby:estado", {
            prontos: [...lobby.prontos]
        });
        if (lobby.prontos.size === 2) {
            console.log(`Os dois jogadores estão prontos no lobby ${lobbyId}`);
        }
    });

    // Iniciar duelo PvP
    socket.on("lobby:iniciar", async (dados) => {
        const { lobbyId } = dados;
        const jogadorId = [...usuariosConectados.entries()]
            .find(([id, socketId]) => socketId === socket.id)?.[0];
        const lobby = lobbies.get(String(lobbyId));
        if (!jogadorId || !lobby || !lobby.jogadores.includes(String(jogadorId))) {
            socket.emit("lobby:erro", "Não foi possível iniciar a partida.");
            return;
        }
        if (lobby.prontos.size !== 2) {
            socket.emit("lobby:erro", "Os dois jogadores precisam estar prontos.");
            return;
        }
        // Impedir que a partida seja iniciada mais de uma vez
        if (lobby.contagemIniciada) return;
        lobby.contagemIniciada = true;
        console.log(`Contagem iniciada no lobby ${lobbyId}`);
        // Enviar contagem regressiva para os dois jogadores
        for (let numero = 3; numero >= 1; numero--) {
            setTimeout(() => {
                io.to(lobbyId).emit("lobby:contagem", numero);
                console.log(`Contagem: ${numero} - Lobby ${lobbyId}`);
            }, (3 - numero) * 1000);
        }
        // Criar partida após a contagem
        setTimeout(async () => {
            const perguntas = await carregarPerguntas();
            if (perguntas.length === 0) {
                lobby.contagemIniciada = false;

                io.to(lobbyId).emit(
                    "pvp:erro",
                    "Não foi possível carregar as perguntas."
                );

                return;
            }
            const partidaId = randomUUID();
            const partida = {
                partidaId,
                lobbyId,
                jogadores: [...lobby.jogadores],
                perguntas,
                progresso: {
                    [lobby.jogadores[0]]: 0,
                    [lobby.jogadores[1]]: 0
                },
                acertos: {
                    [lobby.jogadores[0]]: 0,
                    [lobby.jogadores[1]]: 0
                },
                finalizada: false
            };
            partidas.set(partidaId, partida);
            console.log(`Partida PvP criada: ${partidaId}`);
            console.log(`Perguntas sorteadas: ${perguntas.length}`);
            // Remover a resposta correta antes de enviar aos jogadores
            const perguntasPublicas = perguntas.map(pergunta => ({
                id: pergunta.id,
                pergunta: pergunta.pergunta,
                respostas: pergunta.respostas
            }));
            // Enviar a mesma partida para os dois jogadores
            io.to(lobbyId).emit("pvp:iniciar", {
                partidaId,
                perguntas: perguntasPublicas
            });
        }, 3000);
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

    //Funções para Fazer o PVP funcionar
    // Responder pergunta do PvP
    socket.on("pvp:responder-pergunta", (dados) => {
        const { partidaId, perguntaId, resposta } = dados;
        // Descobrir qual jogador enviou a resposta
        const jogadorId = [...usuariosConectados.entries()]
            .find(([id, socketId]) => socketId === socket.id)?.[0];
        if (!jogadorId) {
            socket.emit("pvp:erro", "Usuário não registrado.");
            return;
        }
        // Encontrar a partida
        const partida = partidas.get(String(partidaId));
        if (!partida) {
            socket.emit("pvp:erro", "Partida não encontrada.");
            return;
        }
        // Verificar se a partida já terminou
        if (partida.finalizada) {
            socket.emit("pvp:erro", "Esta partida já foi finalizada.");
            return;
        }
        // Verificar se o jogador pertence à partida
        if (!partida.jogadores.includes(String(jogadorId))) {
            socket.emit("pvp:erro", "Você não pertence a esta partida.");
            return;
        }
        // Descobrir qual pergunta o jogador deve responder
        const indicePergunta = partida.progresso[String(jogadorId)];
        const pergunta = partida.perguntas[indicePergunta];
        if (!pergunta) {
            socket.emit("pvp:erro", "Você já terminou a partida.");
            return;
        }
        // Verificar se a pergunta enviada é a pergunta atual
        if (String(pergunta.id) !== String(perguntaId)) {
            socket.emit("pvp:erro", "Esta não é a pergunta atual.");
            return;
        }
        // Verificar se a resposta enviada é uma alternativa válida
        const respostaValida = pergunta.respostas.some(
            item => String(item) === String(resposta)
        );
        if (!respostaValida) {
            socket.emit("pvp:erro", "Resposta inválida.");
            return;
        }
        // Verificar se acertou
        const acertou = String(resposta) === String(pergunta.correta);
        // Atualizar progresso
        partida.progresso[String(jogadorId)] += 1;
        // Atualizar acertos
        if (acertou) {
            partida.acertos[String(jogadorId)] += 1;
        }
        console.log(
            `Jogador ${jogadorId} respondeu a pergunta ${perguntaId}:`,
            acertou ? "ACERTOU" : "ERROU"
        );
        console.log("Progresso:", partida.progresso);
        console.log("Acertos:", partida.acertos);
        // Enviar estado atualizado para os dois jogadores
        io.to(partida.lobbyId).emit("pvp:estado", {
            progresso: partida.progresso,
            acertos: partida.acertos
        });
        // Verificar se os dois jogadores terminaram
        const todosTerminaram = partida.jogadores.every(
            id => partida.progresso[id] >= partida.perguntas.length
        );
        if (!todosTerminaram) return;
        // Finalizar partida
        partida.finalizada = true;
        const [jogador1, jogador2] = partida.jogadores;
        const acertosJogador1 = partida.acertos[jogador1];
        const acertosJogador2 = partida.acertos[jogador2];
        const empate = acertosJogador1 === acertosJogador2;
        let vencedorId = null;
        if (!empate) {
            vencedorId = acertosJogador1 > acertosJogador2 ? jogador1 : jogador2;
        }
        console.log(`Partida finalizada: ${partidaId}`);
        if (empate) {
            console.log("Resultado: EMPATE");
        } else {
            console.log(`Vencedor: ${vencedorId}`);
        }
        // Informar o resultado aos dois jogadores
        io.to(partida.lobbyId).emit("pvp:finalizado", {
            partidaId,
            empate,
            vencedorId,
            acertos: partida.acertos
        });
    });
});

console.log("Socket.IO rodando na porta 3001");