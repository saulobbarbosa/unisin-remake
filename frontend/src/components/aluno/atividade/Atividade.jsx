import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import Style from "./atividade.module.css";

export default function TelaAtividade() {
    const navigate = useNavigate();
    const location = useLocation();
    const dadosState = location?.state || {};
    const { materia } = useParams();
    const [pergunta, setPergunta] = useState([]);
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
    const [respondida, setRespondida] = useState(false);

    useEffect(() => {
        const carregarAtividade = async () => {
            try {
                const response = await axios.get("/dadosJson/atividades.json");
                const atividade = response.data[materia]?.find(
                    (item) => item.id === Number(dadosState.idAtividade)
                );
                setPergunta(atividade);
            } catch (error) {
                console.error("Erro ao carregar dados da atividade", error);
            }
        }
        carregarAtividade();
    }, [materia, dadosState.idAtividade]);

    useEffect(() => {
        setRespostaSelecionada(null);
        setRespondida(false);
    }, [pergunta?.id]);

    const acertou = respostaSelecionada !== null &&
        pergunta?.respostas?.[respostaSelecionada] === pergunta?.correta;

    return (
        <div className={Style.containerAtividade}>
            {/* Botão para o User voltar para Trilha */}
            <button className={Style.btnVoltar} onClick={() => { navigate(-1) }}>
                <i className="fa-solid fa-arrow-left"></i>
                <p>Voltar à trilha</p>
            </button>
            <div className={Style.banner}
                style={{ background: dadosState.background }}
            >
                <h1>{materia}</h1>
            </div>
            <div className={Style.containerResponder}>
                <h1>{pergunta?.pergunta}</h1>
                <div className={Style.divRespostas}>
                    {pergunta?.respostas?.map((item, index) => {
                        const correta = item === pergunta?.correta;
                        const selecionada = respostaSelecionada === index;
                        return (
                            <button type="button" key={index}
                                disabled={respondida}
                                className={`
                                    ${Style.resposta} 
                                    ${respostaSelecionada === index ? Style.respostaAtiva : ""}
                                    ${respondida && correta ? Style.respostaCorreta : ""}
                                    ${respondida && selecionada && !acertou ? Style.respostaErrada : ""}
                                    ${respondida && !correta && !selecionada ? Style.respostaOpaca : ""}
                                `}
                                onClick={() => setRespostaSelecionada(index)}
                            >
                                <p>{String.fromCharCode(65 + index)}</p>
                                <h1>{item}</h1>
                            </button>
                        )
                    })}
                </div>
                <button
                    disabled={respostaSelecionada === null || respondida}
                    className={Style.btnConfirmar}
                    onClick={() => { setRespondida(true) }}
                >
                    <p>{respondida ? "Resposta Confirmada" : "Confirmar resposta"}</p>
                </button>
            </div>
        </div>
    );
}