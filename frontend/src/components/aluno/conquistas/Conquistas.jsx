import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./conquista.module.css";

export default function TelaConquistas() {
    const [conquistas, setConquistas] = useState([]);

    useEffect(() => {
        const carregarConquistas = async () => {
            try {
                const response = await axios.get("/dadosJson/conquistas.json");
                setConquistas(response.data);
            } catch (error) {
                console.error("Erro ao carregar conquistas", error);
            }
        };
        carregarConquistas();
    }, []);

    return (
        <div className={Style.containerConquistas}>
            <div className={Style.conteudoConquistas}>
                <header className={Style.cabecalho}>
                    <div className={Style.tituloCabecalho}>
                        <i className="fa-solid fa-trophy"></i>
                        <h1>Suas conquistas</h1>
                    </div>
                    <p>Todas as conquistas de todas as matérias.</p>
                </header>
                <div className={Style.listaConquistas}>
                    {conquistas.map((conquista) => {
                        const concluida = conquista.qtdAtual >= conquista.qtdCompleta;

                        return (
                            <div className={Style.cardConquista} key={conquista.id}>
                                <div className={`${Style.iconeConquista} 
                                        ${!concluida ? Style.bloqueada : ""}
                                    `}
                                >
                                    <span>{conquista.icone}</span>
                                </div>
                                <div className={Style.infoConquista}>
                                    <h3>{conquista.nome}</h3>
                                    <p>{conquista.descricao}</p>
                                    <p>
                                        Progresso: {conquista.qtdAtual} / {conquista.qtdCompleta}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
