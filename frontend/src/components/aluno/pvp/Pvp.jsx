import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Style from "./pvp.module.css";

// import de componente
// import Responder from "../responder/Responder";

export default function TelaPvp() {
    const navigate = useNavigate();
    // const location = useLocation();
    // const { idUser, adversarioId } = location.state || {};
    const [dadosUser, setDadosUser] = useState([]);
    const [dadosOponente, setDadosOponente] = useState([]);
    const [progressoUser, setProgressoUser] = useState(0);
    // const [progressoOponente, setProgressoOponente] = useState(0);

    // Carregar dados Principais quando renderizar componente
    const { idUser, adversarioId } = useParams();
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

    const proximaPergunta = () => {
        setProgressoUser(prev => prev + 1);
        if((indicePergunta + 1) < perguntas.length){
            const proximoIndice = indicePergunta + 1;
            setIndicePergunta(proximoIndice);
            setPergunta(perguntas[proximoIndice]);
            setRespostaSelecionada(null);
        } else {
            setTimeout(() => {
                navigate("/aluno/amigos");
            }, 1000);
        }
    }

    useEffect(() => {
        const carregarPergunta = async () => {
            try {
                const response = await axios.get("/dadosJson/pvp.json");
                const perguntasAleatorias = [...response.data].sort(() => Math.random() - 0.5).slice(0, 5);
                setPerguntas(perguntasAleatorias);
                setPergunta(perguntasAleatorias[0]);
            } catch (error) {
                console.error("Erro ao carregar perguntas para o PVP", error);
            }
        }
        carregarPergunta();
    }, []);

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
                            <p>{"0"} acertos</p>
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
                            <p>{"0"} acertos</p>
                        </div>
                    </div>
                    <div className={Style.barraProgresso}>
                        {/* <div
                            className={Style.progressoAtual}
                            style={{
                                background: "linear-gradient(135deg, #f97316, #dc2626)"
                            }}
                        /> */}
                    </div>
                </div>
            </div>
            {/* Quantidade de Perguntas */}
            <h1 className={Style.qtdPerguntas}>
                Pergunta {indicePergunta + 1} de {perguntas.length}
            </h1>
            {/* Responder Pergunta */}
            <div className={Style.containerResponder}>
                <h1>{pergunta?.pergunta}</h1>
                <div className={Style.divRespostas}>
                    {pergunta?.respostas?.map((item, index) => (
                        <button type="button" key={index}
                            className={`
                                ${Style.resposta} 
                                ${respostaSelecionada === index ? Style.respostaAtiva : ""}
                            `}
                            onClick={() => setRespostaSelecionada(index)}
                        >
                            <p>{String.fromCharCode(65 + index)}</p>
                            <h1>{item}</h1>
                        </button>
                    ))}
                </div>
                <button
                    disabled={respostaSelecionada === null}
                    className={Style.btnConfirmar}
                    onClick={() => { proximaPergunta() }}
                >
                    <p>
                        {indicePergunta + 1 === perguntas.length ? 
                            "Finalizar Duelo" : "Confirmar resposta"
                        }
                    </p>
                </button>
            </div>
        </div>
    );
}