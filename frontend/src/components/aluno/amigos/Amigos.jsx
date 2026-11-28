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
    const [solicitacoesEnviadas, setSolicitacoesEnviadas] = useState([]);
    const [menuAberto, setMenuAberto] = useState(null);
    const [aba, setAba] = useState("amigos");
    const idUser = localStorage.getItem("id");

    // States para Adicionar Amigos
    const [modalAdicionar, setModalAdicionar] = useState(false);
    const [pesquisa, setPesquisa] = useState("");
    const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);

    // SocketIO
    useEffect(() => {
        const receberConvite = (dados) => {
            console.log("Convite PvP recebido:", dados);
            setConvitesPvP(prev => [...prev, dados]);
        };
        const receberErro = (mensagem) => {
            console.log("Erro no convite:", mensagem);
        };
        const receberResposta = (dados) => {
            console.log("Resposta do convite PvP:", dados);
            if (dados.aceito) {
                console.log(`O jogador ${dados.jogadorId} aceitou seu convite!`);
            } else {
                console.log(`O jogador ${dados.jogadorId} recusou seu convite.`);
            }
        };
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
        socket.on("pvp:convite", receberConvite);
        socket.on("pvp:erro", receberErro);
        socket.on("pvp:resposta", receberResposta);
        socket.on("lobby:entrar", entrarNoLobby);
        return () => {
            socket.off("pvp:convite", receberConvite);
            socket.off("pvp:erro", receberErro);
            socket.off("pvp:resposta", receberResposta);
            socket.off("lobby:entrar", entrarNoLobby);
        };
    }, [navigate]);

    const convidarParaPvP = (amigoId) => {
        socket.emit("convite:convidar", {
            idUser,
            adversarioId: String(amigoId)
        });
        console.log("Convite PvP enviado", {
            idUser,
            adversarioId: String(amigoId)
        });
    };

    const responderConvitePvP = (convite, aceito) => {
        socket.emit("convite:responder", {
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

    // CRUD padrão
    const headers = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }

    const carregarDados = async () => {
        try {
            const response = await axios.get("/api/amigos", headers);
            setDadosAmigos(response.data);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    }

    const buscarUsuarios = async () => {
        try {
            const response = await axios.get(
                `/api/amigos/buscar?nome=${encodeURIComponent(pesquisa)}`,
                headers
            );
            setUsuariosEncontrados(response.data);
        } catch (error) {
            console.error("Erro ao Buscar Amigo: ", error);
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
                            <div key={amigo.id_usuario} className={Style.cardAmigo}>
                                <div className={Style.avatarAmigo}>
                                    <img
                                        src={amigo?.avatar || "/imgs/boy_black.webp"}
                                        alt="Avatar dos Amigos"
                                        style={{
                                            border: `0.2rem solid ${amigo?.borda || "#000"}`
                                        }}
                                    />
                                </div>
                                <div className={Style.infoAmigo}>
                                    <h3>{amigo?.nome}</h3>
                                    <div className={Style.status}>
                                        <span className={Style.nivelAmigo}>
                                            <i className="fa-solid fa-star"></i>
                                            Nv. {amigo?.nivel}
                                        </span>
                                        <span className={Style.moedasAmigo}>
                                            <img
                                                src={require('../../../imgs/moeda.png')}
                                                alt="Moedas"
                                                className={Style.iconeMoeda}
                                            />
                                            {amigo?.moedas}
                                        </span>
                                    </div>
                                </div>
                                <div className={Style.menuContainer}>
                                    <button className={Style.btnMenu}
                                        onClick={() => {
                                            setMenuAberto(menuAberto === amigo.id_usuario ?
                                                null : amigo.id_usuario
                                            )
                                        }}
                                    >
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                    {menuAberto === amigo.id_usuario && (
                                        <div className={Style.menuOpcoes}>
                                            <button onClick={() => {
                                                convidarParaPvP(amigo.id_usuario);
                                                setMenuAberto(null);
                                            }}>
                                                <i className="fa-solid fa-gamepad"></i>
                                                Convidar para PvP
                                            </button>
                                            <button
                                                className={Style.btnVerPerfil}
                                                onClick={() => { navigate(`/aluno/perfil/${amigo.id_usuario}`) }}
                                            >
                                                <i className="fa-solid fa-user"></i>
                                                Ver Perfil
                                            </button>
                                            <button
                                                className={Style.btnDesfazer}
                                                onClick={() => {
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
                                usuario => String(usuario.id_usuario) === String(convite.idUser)
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
                                    <button onClick={() => { }}>
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
                            <div className={Style.modalInputPesquisa}>
                                <input type="text" placeholder="Pesquisar por nome ou e-mail..."
                                    value={pesquisa} onChange={(e) => setPesquisa(e.target.value)}
                                />
                                <button onClick={buscarUsuarios}>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                    Buscar
                                </button>
                            </div>
                            {usuariosEncontrados.map(usuario => (
                                <div key={usuario.id_usuario} className={Style.cardAmigo}>
                                    <div className={Style.avatarAmigo}>
                                        <img src={usuario?.avatar || "/imgs/boy_black.webp"}
                                            alt="Avatar do User Encontrado"
                                        />
                                    </div>
                                    <div className={Style.infoAmigo}>
                                        <h3>{usuario.nome}</h3>
                                        <span className={Style.nivelAmigo}>
                                            <i className="fa-solid fa-star"></i>
                                            Nv. {usuario?.nivel}
                                        </span>
                                    </div>
                                    <button
                                        className={Style.btnAdicionarUsuario}
                                        disabled={solicitacoesEnviadas.some(
                                            item => item.id_usuario === usuario.id_usuario
                                        )}
                                        onClick={() => { }}
                                    >
                                        {solicitacoesEnviadas.some(item =>
                                            item.id_usuario === usuario.id_usuario
                                        ) ? "Enviada" : "Adicionar"}
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
