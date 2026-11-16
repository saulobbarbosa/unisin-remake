import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import socket from "../../../services/socket";

import Style from "./amigos.module.css";

export default function TelaAmigos() {
    const navigate = useNavigate();
    const [dadosAmigos, setDadosAmigos] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [convitesPvP, setConvitesPvP] = useState([]);
    const [modalAdicionar, setModalAdicionar] = useState(false);
    const [pesquisa, setPesquisa] = useState("");
    const [solicitacoesEnviadas, setSolicitacoesEnviadas] = useState([]);
    const [menuAberto, setMenuAberto] = useState(null);
    const [aba, setAba] = useState("amigos");
    const idUser = localStorage.getItem("id");

    // Teste de SocketIO
    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("Conectado ao Socket.IO:", socket.id);
            socket.emit("usuario:registrar", idUser);
        });

        socket.on("pvp:convite", (dados) => {
            console.log("Convite PvP recebido:", dados);
            setConvitesPvP(prev => [...prev, dados]);
        });

        socket.on("pvp:erro", (mensagem) => {
            console.log("Erro no convite:", mensagem);
        });

        socket.on("pvp:resposta", (dados) => {
            console.log("Resposta do convite PvP:", dados);

            if (dados.aceito) {
                console.log(`O jogador ${dados.jogadorId} aceitou seu convite!`);
            } else {
                console.log(`O jogador ${dados.jogadorId} recusou seu convite.`);
            }
        });

        const entrarNoLobby = (dados) => {
            console.log("Entrando no lobby:", dados);

            navigate("/aluno/lobby", {
                state: {
                    idUser: dados.idUser,
                    adversarioId: dados.adversarioId,
                    lobbyId: dados.lobbyId
                }
            });
        };

        return () => {
            socket.off("connect");
            socket.off("pvp:convite");
            socket.off("pvp:erro");
            socket.off("pvp:resposta");
            socket.on("lobby:entrar", entrarNoLobby);
            socket.disconnect();
        };
    }, [idUser, navigate]);

    const convidarParaPvP = (amigoId) => {
        socket.emit("pvp:convidar", {
            idUser,
            adversarioId: String(amigoId)
        });
        console.log("Convite PvP enviado", {
            idUser,
            adversarioId: String(amigoId)
        });
    };

    const responderConvitePvP = (convite, aceito) => {
        socket.emit("pvp:responder", {
            convidanteId: String(convite.idUser),
            aceito
        });

        setConvitesPvP(prev =>
            prev.filter(item => item !== convite)
        );

        console.log("Resposta ao convite PvP enviada:", {
            convidanteId: convite.idUser,
            aceito
        });
    };

    // Código Leo
    const carregarDados = async () => {
        try {
            const response = await axios.get("/dadosJson/usuarios.json");
            setDadosAmigos(response.data);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    }

    const carregarSolicitacoes = async () => {
        try {
            const response = await axios.get("/dadosJson/solicitacoes.json");
            setSolicitacoes(response.data);
        } catch (error) {
            console.error("Erro ao carregar solicitações", error);
        }
    };

    useEffect(() => {
        carregarDados();
        carregarSolicitacoes();
    }, []);

    const aceitarSolicitacao = (amigo) => {
        setDadosAmigos(prev => [...prev, amigo]);
        setSolicitacoes(prev => prev.filter(item => item.id !== amigo.id));
    };

    const recusarSolicitacao = (id) => {
        setSolicitacoes(prev => prev.filter(item => item.id !== id));
    };

    const enviarSolicitacao = (usuario) => {
        setSolicitacoesEnviadas(prev => [...prev, usuario]);
    };

    const desfazerAmizade = (id) => {
        setDadosAmigos(prev => prev.filter(amigo => amigo.id !== id));
    };

    return (
        <div className={Style.pagina}>
            <main className={Style.conteudo}>
                {/* CABECALHO DA PÁGINA */}
                <div className={Style.tituloArea}>
                    <div className={Style.titulo}>
                        <i className="fa-solid fa-user-group"></i>
                        <h1>Amigos</h1>
                    </div>

                    <div className={Style.acoes}>
                        <button className={Style.btnAdicionar}
                            onClick={() => setModalAdicionar(true)}
                        >
                            <i className="fa-solid fa-user-plus"></i>
                            Adicionar
                        </button>
                    </div>
                </div>

                {/* ABAS */}
                <div className={Style.abas}>
                    <button
                        className={aba === "amigos" ? Style.abaAtiva : ""}
                        onClick={() => setAba("amigos")}
                    >
                        Meus amigos ({dadosAmigos.length})
                    </button>

                    <button
                        className={aba === "solicitacoes" ? Style.abaAtiva : ""}
                        onClick={() => setAba("solicitacoes")}
                    >
                        Solicitações ({solicitacoes.length + convitesPvP.length})
                    </button>
                </div>

                {/* LISTA */}
                {aba === "amigos" && (
                    <div className={Style.lista}>
                        {dadosAmigos.map(amigo => (
                            <div key={amigo.id} className={Style.cardAmigo}>
                                <div className={Style.avatarAmigo}>
                                    <img
                                        src={amigo.avatar}
                                        alt={`Avatar de ${amigo.nome}`}
                                        style={{
                                            border: `0.2rem solid ${amigo.borda}`
                                        }}
                                    />
                                </div>

                                <div className={Style.infoAmigo}>
                                    <h3>{amigo.nome}</h3>
                                    <div className={Style.status}>
                                        <span className={Style.nivelAmigo}>
                                            <i className="fa-solid fa-star"></i>
                                            Nv. {amigo.nivel}
                                        </span>
                                        <span className={Style.moedasAmigo}>
                                            <img
                                                src={require('../../../imgs/moeda.png')}
                                                alt="Moedas"
                                                className={Style.iconeMoeda}
                                            />
                                            {amigo.moedas}
                                        </span>
                                    </div>
                                </div>

                                <div className={Style.menuContainer}>
                                    <button className={Style.btnMenu}
                                        onClick={() => setMenuAberto(menuAberto === amigo.id ? null : amigo.id)}>
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                    </button>

                                    {menuAberto === amigo.id && (
                                        <div className={Style.menuOpcoes}>

                                            <button onClick={() => {
                                                convidarParaPvP(amigo.id);
                                                setMenuAberto(null);
                                            }}>
                                                <i className="fa-solid fa-gamepad"></i>
                                                Convidar para PvP
                                            </button>

                                            <button
                                                className={Style.btnDesfazer}
                                                onClick={() => {
                                                    desfazerAmizade(amigo.id);
                                                    setMenuAberto(null);
                                                }}
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                                Desfazer amizade
                                            </button>

                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {aba === "solicitacoes" && (
                    <div className={Style.lista}>
                        {convitesPvP.map((convite, index) => {
                            const jogador = dadosAmigos.find(
                                usuario => String(usuario.id) === String(convite.idUser)
                            );

                            return (
                                <div key={`pvp-${index}`} className={Style.cardAmigo}>

                                    <div className={Style.avatarAmigo}>
                                        <img src={jogador?.avatar} alt={jogador?.nome || "Jogador"}
                                            style={{ border: `0.2rem solid ${jogador?.borda || "transparent"}` }}
                                        />
                                    </div>

                                    <div className={Style.infoAmigo}>
                                        <h3>{jogador?.nome}</h3>
                                        <span className={Style.nivelAmigo}
                                            style={{ color: "#e74c3c !important" }}
                                        >
                                            Convite de PvP
                                        </span>
                                    </div>

                                    <div className={Style.acoesSolicitacao}>
                                        <button onClick={() => { responderConvitePvP(convite, true) }}>
                                            Aceitar
                                        </button>

                                        <button onClick={() => { responderConvitePvP(convite, false) }}>
                                            Recusar
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                        {solicitacoes.map(amigo => (
                            <div key={amigo.id} className={Style.cardAmigo}>

                                <div className={Style.avatarAmigo}>
                                    <img src={amigo.avatar} alt={amigo.nome}
                                        style={{ border: `0.2rem solid ${amigo.borda}` }}
                                    />
                                </div>

                                <div className={Style.infoAmigo}>
                                    <h3>{amigo.nome}</h3>
                                    <span className={Style.nivelAmigo}>
                                        Pedido de Amizade
                                    </span>
                                </div>

                                <div className={Style.acoesSolicitacao}>
                                    <button onClick={() => aceitarSolicitacao(amigo)}>
                                        Aceitar
                                    </button>
                                    <button onClick={() => recusarSolicitacao(amigo.id)}>
                                        Recusar
                                    </button>
                                </div>

                            </div>
                        ))}

                        {solicitacoes.length === 0 && convitesPvP.length === 0 && (
                            <p>Nenhuma solicitação pendente.</p>
                        )}
                    </div>
                )}
                {modalAdicionar && (
                    <div className={Style.modal}>
                        <div className={Style.modalConteudo}>

                            <h2>Adicionar amigos</h2>

                            <input type="text" placeholder="Pesquisar por nome ou e-mail..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />

                            {dadosAmigos
                                .filter(usuario =>
                                    usuario.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                                    usuario.email.toLowerCase().includes(pesquisa.toLowerCase())
                                )
                                .map(usuario => (
                                    <div key={usuario.id} className={Style.cardAmigo}>

                                        <div className={Style.avatarAmigo}>
                                            <img src={usuario.avatar} alt={usuario.nome} />
                                        </div>

                                        <div className={Style.infoAmigo}>
                                            <h3>{usuario.nome}</h3>

                                            <span className={Style.nivelAmigo}>
                                                <i className="fa-solid fa-star"></i>
                                                Nv. {usuario.nivel}
                                            </span>
                                        </div>

                                        <button
                                            className={Style.btnAdicionarUsuario}
                                            disabled={solicitacoesEnviadas.some(item => item.id === usuario.id)}
                                            onClick={() => enviarSolicitacao(usuario)}
                                        >
                                            {solicitacoesEnviadas.some(item => item.id === usuario.id)
                                                ? "Enviada" : "Adicionar"}
                                        </button>

                                    </div>
                                ))}

                            <button className={Style.btnFechar}
                                onClick={() => setModalAdicionar(false)}>
                                Fechar
                            </button>

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
