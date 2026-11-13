import React, { useState, useEffect } from "react";

import Style from "./responder.module.css";

export default function CompResponderAtividade({ pergunta }) {
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
    const [respondida, setRespondida] = useState(false);

    useEffect(() => {
        setRespostaSelecionada(null);
        setRespondida(false);
    }, [pergunta?.id]);

    const acertou = respostaSelecionada !== null &&
        pergunta?.respostas?.[respostaSelecionada] === pergunta?.correta;

    return (
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
    );
}