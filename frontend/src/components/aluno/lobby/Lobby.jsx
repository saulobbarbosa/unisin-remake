import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Style from "./lobby.module.css";
import axios from "axios";

export default function TelaLobby() {
    const navigate = useNavigate();
    const { adversarioId } = useParams();
    const [pronto, setPronto] = useState();
    const [oponentePronto, setOponentePronto] = useState();
    const [dadosUser, setDadosUser] = useState([]);
    const [dadosOponente, setDadosOponente] = useState([]);

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
                const idUser = localStorage.getItem("id");
                const usuario = response.data.find(u => String(u.id) === String(idUser));
                const oponente = response.data.find(u => String(u.id) === String(adversarioId));
                if (!usuario || !oponente) {
                    console.error("Usuário não encontrado para o ID:", idUser);
                    return;
                }
                setDadosUser(usuario);
                setDadosOponente(oponente);
            } catch (error) {
                console.error("Erro ao Carregar dados", error);
            }
        }

        setPronto(false);
        setOponentePronto(true);
        carregarDados();
    }, [adversarioId]);

    return (
        <div className={Style.containerLobby}>
            <div className={Style.tituloLobby}>
                <i className="fa-solid fa-shield"></i>
                <h1>Lobby PvP</h1>
            </div>
            <div className={Style.divApresentacao}>
                <div className={Style.mostrarUser}>
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
                    <div className={Style.cardUser}>
                        <div className={Style.avatar}>
                            <img src={dadosOponente?.avatar} alt="Avatar Usuário"
                                style={{ border: `0.3rem solid ${dadosOponente?.borda}` }}
                            />
                        </div>
                        <div className={Style.texto}>
                            <h1>{dadosOponente?.nome}</h1>
                            <p>Nv. {dadosOponente?.nivel}</p>
                            <span className={Style.spanPronto}>
                                Pronto
                            </span>
                        </div>
                    </div>
                </div>
                <div className={Style.divBtnAcao}>
                    {pronto ? (
                        <button className={Style.btnPronto}
                            onClick={() => { setPronto(!pronto) }}
                        >
                            <i className="fa-solid fa-check"></i>
                            <p>Pronto!</p>
                        </button>
                    ) : (
                        <button className={Style.btnFicarPronto}
                            onClick={() => { setPronto(!pronto) }}
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