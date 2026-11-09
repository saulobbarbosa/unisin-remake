import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import Style from "./trilha.module.css";

export default function TelaTrilha() {
    const navigate = useNavigate();
    const location = useLocation();
    const { materia } = useParams();
    const idMateria = location.state?.idMateria
    const [atividades, setAtividades] = useState([]);

    // Estrutura de Dados para pegar um gradient para matérias
    const [materias, setMaterias] = useState([]);

    // Função para Pegar o Baground Gradient certo
    const backgroundAtual = materias.find(
        (item) => item.id === Number(idMateria)
    )?.gradient ?? "linear-gradient(135deg, #006bed, #003b8e)";

    useEffect(() => {
        if (!idMateria) {
            navigate("/aluno/home", { replace: true });
            return;
        }
        // Carregar Dados das Atividades
        const carregarDados = async () => {
            try {
                const response = await axios.get("/dadosJson/atividades.json");
                const ativ = response.data[materia];
                if (!ativ) {
                    console.error("Atividades não encontradas para a Matéria:", materia);
                    return;
                }
                setAtividades(ativ);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        // Carregar Matérias
        const carregarMaterias = async () => {
            try {
                const response = await axios.get("/dadosJson/materias.json");
                setMaterias(response.data);
            } catch (error) {
                console.error("Erro ao carregar matérias", error);
            }
        }

        carregarDados();
        carregarMaterias();
    }, [materia, idMateria, navigate]);

    return (
        <div className={Style.containerTrilha}>
            {/* Botão para o User voltar para Home */}
            <button className={Style.btnVoltar} onClick={() => { navigate(-1) }}>
                <i className="fa-solid fa-arrow-left"></i>
                <p>Voltar às matérias</p>
            </button>
            {/* Banner da Matéria */}
            <div className={Style.banner}
                style={{ background: backgroundAtual }}
            >
                <div className={Style.efeitoBanner}></div>
                <div className={Style.divTexto}>
                    <p className={Style.subTitulo}>Matéria</p>
                    <h1>{materia}</h1>
                    <p>Nível 1 • 0% concluído</p>
                </div>
            </div>
            <div className={Style.configParteBaixo}>
                {/* Trilha/Lista de Atividade */}
                <div className={Style.divTrilha}>
                    <h1>Trilha de aprendizagem</h1>
                    <div className={Style.trilha}>
                        {atividades.map((atividade, index) => (
                            <div key={atividade.id}
                                className={Style.divAtividade}
                                style={index % 2 !== 0 ? { marginLeft: "8rem" } : {}}
                                onClick={() => {
                                    if(atividade.respondida){
                                        navigate(`/aluno/${materia}/atividade`, {
                                            state: {
                                                idMateria,
                                                idAtividade: atividade.id,
                                                background: backgroundAtual
                                            }
                                        });
                                    }
                                }}
                            >
                                <div className={`
                                    ${Style.divIcon} 
                                    ${atividade.respondida ? Style.divIconAtivado : Style.divIconDesativado}
                                `}>
                                    {atividade.respondida ?
                                        (<i className="fa-solid fa-play"></i>)
                                        :
                                        (<i className="fa-solid fa-lock"></i>)
                                    }
                                    <div className={Style.numAtividade}>
                                        <p>{index + 1}</p>
                                    </div>
                                </div>
                                <div className={Style.textoTrilha}>
                                    <h1>
                                        {atividade.respondida ?
                                            "Disponível agora"
                                            :
                                            "Bloqueada"
                                        }
                                    </h1>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Parte das Conquistas */}
                <div className={Style.divConquistas}>
                    <div className={Style.tituloConquista}>
                        <i className="fa-solid fa-trophy"></i>
                        <h1>Conquistas</h1>
                    </div>
                    <div className={Style.listaConquistas}>
                        {/* Array Map aqui */}
                        <div className={Style.blocoConquista}>
                            <p>🥉</p>
                            <div className={Style.infoConquista}>
                                <h1>Primeiros passos</h1>
                                <p>Conclua sua primeira missão.</p>
                                <div className={Style.barraProgresso}>
                                    <div
                                        className={Style.progressoPreenchido}
                                        style={{ width: "100%" }}
                                    ></div>
                                </div>
                                <p>1/1</p>
                            </div>
                        </div>
                        <div className={Style.blocoConquista}>
                            <p>🧮</p>
                            <div className={Style.infoConquista}>
                                <h1>Calculista</h1>
                                <p>Acerte 20 questões.</p>
                                <div className={Style.barraProgresso}>
                                    <div
                                        className={Style.progressoPreenchido}
                                        style={{ width: "50%" }}
                                    ></div>
                                </div>
                                <p>10/20</p>
                            </div>
                        </div>
                        <div className={Style.blocoConquista}>
                            <p>🏅</p>
                            <div className={Style.infoConquista}>
                                <h1>Mestre da Matemática</h1>
                                <p>Resolva 100 questões.</p>
                                <div className={Style.barraProgresso}>
                                    <div
                                        className={Style.progressoPreenchido}
                                        style={{ width: "10%" }}
                                    ></div>
                                </div>
                                <p>10/100</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}