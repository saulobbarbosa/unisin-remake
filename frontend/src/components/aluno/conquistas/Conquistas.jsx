/*VOU CAÇAR MAIS DE 1 MILHÃO DE VAGALUMES POR AIIIIIIIIIIIII*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import Style from "./conquista.module.css";

function AlunoConquistas() {
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
                    <h1>Suas conquistas</h1>
                    <p>Todas as conquistas de todas as matérias.</p>
                </header>

                {conquistas.map((materia) => (
                    <section className={Style.secaoMateria} key={materia.id}>

                        <h2>{materia.materia}</h2>

                        <div className={Style.listaConquistas}>
                            {materia.conquistas.map((conquista) => (
                                <div className={Style.cardConquista} key={conquista.id}>

                                    <div className={`${Style.iconeConquista} ${conquista.qtdAtual >= conquista.qtdCompleta ? Style.concluida : Style.bloqueada}`}>
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
                            ))}
                        </div>

                    </section>
                ))}

            </div>

        </div>
    );
}

export default AlunoConquistas;
