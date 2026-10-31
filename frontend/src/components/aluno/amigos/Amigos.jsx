import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./amigos.module.css";

export default function TelaAmigos() {
    const [dadosAmigos, setDadosAmigos] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [modalAdicionar, setModalAdicionar] = useState(false);
    const [pesquisa, setPesquisa] = useState("");
    const [solicitacoesEnviadas, setSolicitacoesEnviadas] = useState([]);
    const [menuAberto, setMenuAberto] = useState(null);
    const [aba, setAba] = useState("amigos");

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

    const convidarParaPvP = (amigo) => {
        console.log("Convite para PvP enviado para:", amigo.nome);
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
                        Solicitações ({solicitacoes.length})
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
                                        ⋮
                                    </button>

                                    {menuAberto === amigo.id && (
                                        <div className={Style.menuOpcoes}>

                                            <button onClick={() => {
                                                convidarParaPvP(amigo);
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
                        {solicitacoes.map(amigo => (
                            <div key={amigo.id} className={Style.cardAmigo}>

                                <div className={Style.avatarAmigo}>
                                    <img src={amigo.avatar} alt={amigo.nome} />
                                </div>

                                <div className={Style.infoAmigo}>
                                    <h3>{amigo.nome}</h3>

                                    <span className={Style.nivelAmigo}>
                                        <i className="fa-solid fa-star"></i>
                                        Nv. {amigo.nivel}
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

                        {solicitacoes.length === 0 && (
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
