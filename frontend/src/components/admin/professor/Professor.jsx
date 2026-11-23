import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./professor.module.css";

export default function TelaEscola() {

    const [atividades, setAtividades] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

    useEffect(() => {
        const carregarAtividades = async () => {
            try {
                const response = await axios.get("/dadosJson/tarefas.json");
                setAtividades(response.data);
            } catch (error) {
                console.error("Erro ao carregar atividades:", error);
            }
        };

        carregarAtividades();
    }, []);

    return (
        <div className={Style.containerProfessor}>
            {!atividadeSelecionada && (
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
            )}

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
                                <label>Título</label>
                                <input
                                    type="text"
                                    placeholder="Ex.: Lista de exercícios"
                                    required
                                />
                            </div>

                            <div className={Style.campoFormulario}>
                                <label>Descrição</label>
                                <textarea
                                    placeholder="Instruções para os alunos"
                                    required
                                ></textarea>
                            </div>

                            <div className={Style.camposLinha}>

                                <div className={Style.campoFormulario}>
                                    <label>Matéria</label>
                                    <select required>
                                        <option value="Matemática">Matemática</option>
                                        <option value="Português">Português</option>
                                        <option value="História">História</option>
                                        <option value="Ciências">Ciências</option>
                                    </select>
                                </div>

                                <div className={Style.campoFormulario}>
                                    <label>Prazo</label>
                                    <input type="date" required />
                                </div>

                            </div>

                            <button className={Style.btnEnviarAtividade} type="submit">
                                Cadastrar atividade
                            </button>

                        </form>

                    </div>

                </div>
            )}

            {atividadeSelecionada ? (

                <div className={Style.detalhesAtividade}>

                    <button
                        className={Style.btnVoltar}
                        onClick={() => setAtividadeSelecionada(null)}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Voltar
                    </button>

                    <div className={Style.cabecalhoDetalhes}>

                        <span className={Style.materiaAtividade}>
                            {atividadeSelecionada.materia}
                        </span>

                        <h1>{atividadeSelecionada.titulo}</h1>

                        <p>{atividadeSelecionada.descricao}</p>

                    </div>

                    <div className={Style.infoDetalhesAtividade}>

                        <div className={Style.itemDetalhe}>
                            <i className="fa-regular fa-calendar"></i>
                            <div>
                                <span>Prazo de entrega</span>
                                <strong>{atividadeSelecionada.prazo}</strong>
                            </div>
                        </div>

                        <div className={Style.itemDetalhe}>
                            <i className="fa-solid fa-users"></i>
                            <div>
                                <span>Entregas realizadas</span>
                                <strong>
                                    {atividadeSelecionada.entregas} de {atividadeSelecionada.totalAlunos} alunos
                                </strong>
                            </div>
                        </div>

                        <div className={Style.itemDetalhe}>
                            <i className="fa-solid fa-chart-line"></i>
                            <div>
                                <span>Porcentagem de entrega</span>
                                <strong>
                                    {atividadeSelecionada.totalAlunos > 0 ? Math.round((atividadeSelecionada.entregas / atividadeSelecionada.totalAlunos) * 100): 0}%
                                </strong>
                            </div>
                        </div>

                    </div>

                    <div className={Style.listaEntregas}>

                        <h2>Entregas dos alunos</h2>

                        <p>Aqui aparecerão os alunos que enviaram esta atividade,
                            suas entregas e o status da correção.</p>

                    </div>

                </div>

            ) : (

                <div className={Style.listaAtividades}>

                    {atividades.map((atividade) => {
                        const porcentagem = atividade.totalAlunos > 0
                            ? Math.round((atividade.entregas / atividade.totalAlunos) * 100)
                            : 0;

                        return (
                            <div
                                className={Style.cardAtividade}
                                key={atividade.id}
                                onClick={() => setAtividadeSelecionada(atividade)}
                            >

                                <div className={Style.materiaAtividade}>
                                    {atividade.materia}
                                </div>

                                <div className={Style.infoAtividade}>
                                    <h3>{atividade.titulo}</h3>
                                    <p>{atividade.descricao}</p>
                                </div>

                                <div className={Style.dadosAtividade}>
                                    <p>
                                        <i className="fa-regular fa-calendar"></i>
                                        Prazo: {atividade.prazo}
                                    </p>

                                    <div className={Style.entregasAtividade}>
                                        <div className={Style.infoEntregas}>
                                            <span>
                                                {atividade.entregas} de {atividade.totalAlunos} alunos
                                            </span>

                                            <span>{porcentagem}%</span>
                                        </div>

                                        <div className={Style.barraProgresso}>
                                            <div style={{ width: `${porcentagem}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        );
                    })}

                </div>

            )}
        </div>
    );
}