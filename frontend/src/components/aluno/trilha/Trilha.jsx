import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import Style from "./trilha.module.css";

import ConquistaRecente from "../conquista-recente/ConquistaRecente";

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
                <ConquistaRecente />
            </div>
        </div >
    );
}