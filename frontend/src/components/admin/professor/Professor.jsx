import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./professor.module.css";

export default function TelaEscola() {
    const [atividades, setAtividades] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);

    useEffect(() => {
        const carregarAtividades = async () => {
            try {
                const response = await axios.get("/dadosJson/atividades.json");
                const ativs = response.data["Matemática"];
                setAtividades(ativs);
            } catch (error) {
                console.error("Erro ao carregar atividades:", error);
            }
        };

        carregarAtividades();
    }, []);

    return (
        <div className={Style.containerProfessor}>

            <div className={Style.divTitulo}>
                <div>
                    <div className={Style.divIconAtividade}>
                        <i className="fa-solid fa-clipboard-list"></i>
                        <h1>Atividades</h1>
                    </div>
                    <p className={Style.paragrafoTitulo}>
                        Acompanhe as entregas dos alunos.
                    </p>
                </div>
                <button className={Style.btnCadastrar} onClick={() => setModalAberto(true)}>
                    <p>+ Nova Atividade</p>
                </button>
            </div>

            {modalAberto && (
                <div className={Style.overlayModal} onClick={() => setModalAberto(false)}>
                    <div className={Style.modalAtividade} onClick={(e) => e.stopPropagation()}>
                        <div className={Style.tituloFormulario}>
                            <div className={Style.divIconAtividade}>
                                <i className="fa-solid fa-plus"></i>
                                <h1>Nova atividade</h1>
                            </div>
                            <button
                                className={Style.btnFecharModal}
                                onClick={() => setModalAberto(false)}
                                type="button"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form
                            className={Style.formNovaAtividade}
                            onSubmit={(e) => {
                                e.preventDefault();
                                setModalAberto(false);
                            }}
                        >
                            <div className={Style.campoFormulario}>
                                <label>Pergunta</label>
                                <input
                                    className={Style.inputTexto}
                                    type="text" placeholder="Quanto é X / Y?"
                                    required
                                />
                            </div>
                            <div className={Style.campoFormulario}>
                                <label>Alternativas</label>
                                <span className={Style.infoAlternativas}>
                                    Selecione a alternativa correta.
                                </span>
                                <div className={Style.inputsOpcoes}>
                                    <div className={Style.opcaoInput}>
                                        <input
                                            className={Style.inputRadio} required
                                            type="radio" name="opcaoCorreta" value="0"
                                        />
                                        <input
                                            className={Style.inputTexto}
                                            type="text" placeholder="Opção 1"
                                            required
                                        />
                                    </div>
                                    <div className={Style.opcaoInput}>
                                        <input
                                            className={Style.inputRadio}
                                            type="radio" name="opcaoCorreta" value="1"
                                        />
                                        <input
                                            className={Style.inputTexto}
                                            type="text" placeholder="Opção 2"
                                            required
                                        />
                                    </div>
                                    <div className={Style.opcaoInput}>
                                        <input
                                            className={Style.inputRadio}
                                            type="radio" name="opcaoCorreta" value="2"
                                        />
                                        <input
                                            className={Style.inputTexto}
                                            type="text" placeholder="Opção 3"
                                            required
                                        />
                                    </div>
                                    <div className={Style.opcaoInput}>
                                        <input
                                            className={Style.inputRadio}
                                            type="radio" name="opcaoCorreta" value="3"
                                        />
                                        <input
                                            className={Style.inputTexto}
                                            type="text" placeholder="Opção 4"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <button className={Style.btnEnviarAtividade} type="submit">
                                Cadastrar atividade
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <div className={Style.listaAtividades}>
                {atividades.map((atividade) => (
                    <div className={Style.cardAtividade} key={atividade.id}>
                        <div className={Style.infoAtividade}>
                            <h1>{atividade.pergunta}</h1>
                            <p>{"32"} alunos responderam</p>
                        </div>
                        <div className={Style.mostrarOpcoes}>
                            <p>Opções:</p>
                            <div className={Style.opcoes}>
                                {atividade?.respostas?.map((item, index) => (
                                    <p key={index}>
                                        {String.fromCharCode(65 + index)}{") "}{item}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className={Style.acoesAtividade}>
                            <button className={Style.btnEditar}>
                                <i className="fa-solid fa-pen"></i>
                                Editar
                            </button>
                            <button className={Style.btnRemover}>
                                <i className="fa-regular fa-trash-can"></i>
                                Remover
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}