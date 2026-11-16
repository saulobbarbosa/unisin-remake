import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import socket from "../../../services/socket";

import Style from "./lobby.module.css";
import axios from "axios";

export default function TelaLobby() {
    const navigate = useNavigate();
    const location = useLocation();
    const { idUser, adversarioId, lobbyId } = location.state || {};
    const [pronto, setPronto] = useState(false);
    const [oponentePronto, setOponentePronto] = useState(false);
    const [dadosUser, setDadosUser] = useState([]);
    const [dadosOponente, setDadosOponente] = useState([]);

    // Funções para SocketIO
    useEffect(() => {
        const conectarLobby = () => {
            console.log("Conectado ao lobby:", socket.id);
            socket.emit("usuario:registrar", String(idUser));
            socket.emit("lobby:reentrar", {
                lobbyId,
                idUser: String(idUser)
            });
        };
        const atualizarEstadoLobby = (dados) => {
            const jogadoresProntos = dados.prontos || [];
            setPronto(jogadoresProntos.includes(String(idUser)));
            setOponentePronto(jogadoresProntos.includes(String(adversarioId)));
        };
        const erroLobby = (mensagem) => {
            console.error("Erro ao entrar no lobby:", mensagem);
        };
        socket.on("connect", conectarLobby);
        socket.on("lobby:estado", atualizarEstadoLobby);
        socket.on("lobby:erro", erroLobby);
        if (socket.connected) {
            conectarLobby();
        } else {
            socket.connect();
        }
        return () => {
            socket.off("connect", conectarLobby);
            socket.off("lobby:estado", atualizarEstadoLobby);
            socket.off("lobby:erro", erroLobby);
            socket.disconnect();
        };
    }, [idUser, adversarioId, lobbyId]);

    // Função de Toggle do Pronto dos usuários
    const alternarPronto = () => {
        if (!socket.connected || !lobbyId) return;

        socket.emit("lobby:pronto", {
            lobbyId,
            pronto: !pronto
        });
    };

    // Funções para fazer uma contagem regresiva aparecer
    const [contagem, setContagem] = useState(null);

    useEffect(() => {
        if (contagem === null) return;

        if (contagem === 1) {
            const timer = setTimeout(() => {
                // Trocar dps para rota de pvp real
                navigate(`/aluno/pvp/${adversarioId}`);
            }, 1000);

            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setContagem(atual => atual - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [contagem, adversarioId, navigate]);

    const iniciarBatalha = () => {
        if (!pronto || !oponentePronto || contagem !== null) return;

        setContagem(3);
    };

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

    return (
        <div className={Style.containerLobby}>
            <div className={Style.tituloLobby}>
                <i className="fa-solid fa-shield"></i>
                <h1>Lobby PvP</h1>
            </div>
            <div className={Style.divApresentacao}>
                <div className={Style.mostrarUser}>
                    {/* User 1 */}
                    <div className={Style.cardUser}>
                        <div className={Style.avatar}>
                            <img src={dadosUser?.avatar} alt="Avatar Usuário"
                                style={{ border: `0.3rem solid ${dadosUser?.borda}` }}
                            />
                        </div>
                        <div className={Style.texto}>
                            <h1>{dadosUser?.nome}</h1>
                            <p>Nv. {dadosUser?.nivel}</p>
                            <span
                                className={pronto ? Style.spanPronto : Style.spanAguardo}
                            >
                                {pronto ? "Pronto" : "Aguardando..."}
                            </span>
                        </div>
                    </div>
                    <h1>VS</h1>
                    {/* User 2 */}
                    <div className={Style.cardUser}>
                        <div className={Style.avatar}>
                            <img src={dadosOponente?.avatar} alt="Avatar Usuário"
                                style={{ border: `0.3rem solid ${dadosOponente?.borda}` }}
                            />
                        </div>
                        <div className={Style.texto}>
                            <h1>{dadosOponente?.nome}</h1>
                            <p>Nv. {dadosOponente?.nivel}</p>
                            <span
                                className={oponentePronto ? Style.spanPronto : Style.spanAguardo}
                            >
                                {oponentePronto ? "Pronto" : "Aguardando..."}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={Style.divBtnAcao}>
                    {pronto ? (
                        <button className={Style.btnPronto}
                            onClick={() => { alternarPronto() }}
                        >
                            <i className="fa-solid fa-check"></i>
                            <p>Pronto!</p>
                        </button>
                    ) : (
                        <button className={Style.btnFicarPronto}
                            onClick={() => { alternarPronto() }}
                        >
                            <p>Estou Pronto</p>
                        </button>
                    )}
                    <button className={Style.btnPlay}
                        disabled={!pronto || !oponentePronto}
                        style={{
                            opacity: pronto && oponentePronto ? "1" : "0.5",
                            cursor: pronto && oponentePronto ? "pointer" : "not-allowed"
                        }}
                        onClick={() => { iniciarBatalha() }}
                    >
                        <i className="fa-solid fa-play"></i>
                        <p>Iniciar Duelo</p>
                    </button>
                    <button className={Style.btnSair} onClick={() => { navigate(-1) }}>
                        <i className="fa-solid fa-x"></i>
                        <p>Sair do PvP</p>
                    </button>
                </div>
            </div>
            {/* Elemento de Contagem Regresiva */}
            {contagem !== null && (
                <div className={Style.overlayContagem}>
                    <h1 key={contagem}>
                        {contagem}
                    </h1>
                    <p>Prepare-se para a batalha!</p>
                </div>
            )}
        </div>
    );
}