import React, { useState } from "react";

import Style from "./responder.module.css";

export default function CompResponderAtividade({ pergunta }) {
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);

    return (
        <div className={Style.containerResponder}>
            <h1>{pergunta?.pergunta}</h1>
            <div className={Style.divRespostas}>
                {pergunta?.respostas?.map((item, index) => (
                    <button type="button" key={index}
                        className={`${Style.resposta} 
                            ${respostaSelecionada === index ? Style.respostaAtiva : ""}
                        `}
                        onClick={() => setRespostaSelecionada(index)}
                    >
                        <p>{String.fromCharCode(65 + index)}</p>
                        <h1>{item}</h1>
                    </button>
                ))}
            </div>
            <button className={Style.btnConfirmar} disabled={respostaSelecionada === null}>
                <p>Confirmar resposta</p>
            </button>
        </div>
    );
}