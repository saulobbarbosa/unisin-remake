import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import socket from "../../../services/socket";

import Style from "./pvp.module.css";

export default function TelaPvp() {
    const navigate = useNavigate();
    const location = useLocation();
    const { idUser, adversarioId, partidaId, perguntas: perguntasRecebidas } = location.state || {};

    const [dadosUser, setDadosUser] = useState([]);
    const [dadosOponente, setDadosOponente] = useState([]);
    const [progressoUser, setProgressoUser] = useState(0);
    const [progressoOponente, setProgressoOponente] = useState(0);
    const [acertosUser, setAcertosUser] = useState(0);
    const [acertosOponente, setAcertosOponente] = useState(0);

    // Carregar dados Principais quando renderizar componente
    useEffect(() => {
        const carregarDados = async () => {
            try {
                const response = await axios.get("/dadosJson/usuarios.json");
                const usuario = response.data.find(u => String(u.id) === String(idUser));
                const oponente = response.data.find(u => String(u.id) === String(adversarioId));
                if (!usuario || !oponente) {
                    console.error("Usuário não encontrado");
                    return;
                }
                setDadosUser(usuario);
                setDadosOponente(oponente);
            } catch (error) {
                console.error("Erro ao Carregar dados", error);
            }
        }
        carregarDados();
    }, [idUser, adversarioId]);

    // Funções para responder as perguntas
    const [perguntas, setPerguntas] = useState([]);
    const [indicePergunta, setIndicePergunta] = useState(0);
    const [pergunta, setPergunta] = useState([]);
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
    const [respondendo, setRespondendo] = useState(false);

    useEffect(() => {
        if (!perguntasRecebidas || perguntasRecebidas.length === 0) {
            console.error("Perguntas da partida não foram recebidas.");
            return;
        }
        setPerguntas(perguntasRecebidas);
        setPergunta(perguntasRecebidas[0]);
    }, [perguntasRecebidas]);

    // Sincronizar respostas e progresso com o servidor
    useEffect(() => {
        const atualizarEstado = (dados) => {
            setProgressoUser(dados.progresso[String(idUser)] || 0);
            setProgressoOponente(dados.progresso[String(adversarioId)] || 0);
            setAcertosUser(dados.acertos[String(idUser)] || 0);
            setAcertosOponente(dados.acertos[String(adversarioId)] || 0);
        };

        const finalizarPartida = (dados) => {
            if (dados.empate) {
                setVencedor("Empate!");
            } else {
                const nomeVencedor = String(dados.vencedorId) === String(idUser)
                    ? dadosUser.nome
                    : dadosOponente.nome;

                setVencedor(nomeVencedor || "Vencedor");
            }
        };

        const erroPvp = (mensagem) => {
            console.error("Erro no PvP:", mensagem);
            setRespondendo(false);
        };

        socket.on("pvp:estado", atualizarEstado);
        socket.on("pvp:finalizado", finalizarPartida);
        socket.on("pvp:erro", erroPvp);

        return () => {
            socket.off("pvp:estado", atualizarEstado);
            socket.off("pvp:finalizado", finalizarPartida);
            socket.off("pvp:erro", erroPvp);
        };
    }, [idUser, adversarioId, dadosUser.nome, dadosOponente.nome]);

    // Avançar pergunta somente após confirmação do servidor
    useEffect(() => {
        if (progressoUser > indicePergunta && progressoUser < perguntas.length) {
            setIndicePergunta(progressoUser);
            setPergunta(perguntas[progressoUser]);
            setRespostaSelecionada(null);
            setRespondendo(false);
        }
    }, [progressoUser, indicePergunta, perguntas]);

    // Enviar resposta ao servidor
    const confirmarResposta = () => {
        if (
            respostaSelecionada === null ||
            respondendo ||
            progressoUser >= perguntas.length ||
            !socket.connected
        ) {
            return;
        }

        setRespondendo(true);

        socket.emit("pvp:responder-pergunta", {
            partidaId,
            perguntaId: pergunta.id,
            resposta: respostaSelecionada
        });
    };

    // Funções para fazer uma mensagem de vencedor aparecer
    const [vencedor, setVencedor] = useState(null);

    useEffect(() => {
        if (vencedor === null) return;
        const timer = setTimeout(() => {
            navigate(`/aluno/amigos`);
        }, 4000)
        return () => clearTimeout(timer);
    }, [vencedor, navigate]);

    return (
        <div className={Style.containerPvp}>
            <div className={Style.tituloPvp}>
                <i className="fa-solid fa-khanda"></i>
                <h1>PvP</h1>
            </div>
            {/* Placar */}
            <div className={Style.divPontuacao}>
                <div className={Style.divPlayer}>
                    <div className={Style.player}>
                        <img src={dadosUser.avatar} alt="Avatar Player"
                            style={{ border: `0.2rem solid ${dadosUser.borda}` }}
                        />
                        <div className={Style.textoPlayer}>
                            <h1>{dadosUser.nome}</h1>
                            <p>{acertosUser} acertos</p>
                        </div>
                    </div>
                    <div className={Style.barraProgresso}>
                        <div
                            className={Style.progressoAtual}
                            style={{
                                width: `${perguntas.length > 0 ?
                                    ((progressoUser / perguntas.length) * 100) : 0}%
                                `,
                                background: "linear-gradient(135deg, #006bed, #0099fa)"
                            }}
                        />
                    </div>
                </div>
                <h1 className={Style.versus}>VS</h1>
                <div className={Style.divPlayer}>
                    <div className={Style.player}>
                        <img src={dadosOponente.avatar} alt="Avatar Player"
                            style={{ border: `0.2rem solid ${dadosOponente.borda}` }}
                        />
                        <div className={Style.textoPlayer}>
                            <h1>{dadosOponente.nome}</h1>
                            <p>{acertosOponente} acertos</p>
                        </div>
                    </div>
                    <div className={Style.barraProgresso}>
                        <div
                            className={Style.progressoAtual}
                            style={{
                                width: `${perguntas.length > 0 ?
                                    ((progressoOponente / perguntas.length) * 100) : 0}%
                                `,
                                background: "linear-gradient(135deg, #f97316, #dc2626)"
                            }}
                        />
                    </div>
                </div>
            </div>
            {/* Quantidade de Perguntas */}
            <h1 className={Style.qtdPerguntas}>
                Pergunta {Math.min(progressoUser + 1, perguntas.length)} de {perguntas.length}
            </h1>
            {/* Responder Pergunta */}
            <div className={Style.containerResponder}>
                <h1>{pergunta?.pergunta}</h1>
                <div className={Style.divRespostas}>
                    {pergunta?.respostas?.map((item, index) => (
                        <button type="button" key={index}
                            disabled={respondendo || progressoUser >= perguntas.length}
                            className={`
                                ${Style.resposta} 
                                ${respostaSelecionada === item ? Style.respostaAtiva : ""}
                            `}
                            onClick={() => setRespostaSelecionada(item)}
                        >
                            <p>{String.fromCharCode(65 + index)}</p>
                            <h1>{item}</h1>
                        </button>
                    ))}
                </div>
                <button
                    disabled={
                        respostaSelecionada === null ||
                        respondendo ||
                        progressoUser >= perguntas.length
                    }
                    className={Style.btnConfirmar}
                    onClick={() => { confirmarResposta() }}
                >
                    <p>
                        {respondendo
                            ? "Aguardando confirmação..."
                            : progressoUser >= perguntas.length
                                ? "Aguardando adversário..."
                                : progressoUser + 1 === perguntas.length
                                    ? "Finalizar Duelo"
                                    : "Confirmar resposta"
                        }
                    </p>
                </button>
            </div>
            {/* Elemento de Mostrar Vencedor */}
            {vencedor !== null && (
                <div className={Style.overlayVencedor}>
                    <h1>{vencedor === "Empate!" ? "🤝" : "🏆"}</h1>
                    <h2>{vencedor === "Empate!" ? "Resultado!" : "Vencedor(a)!"}</h2>
                    <p>{vencedor}</p>
                </div>
            )}
        </div>
    );
}