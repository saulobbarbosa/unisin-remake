import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Style from "./homeAluno.module.css";

export default function TelaHomeAluno() {
    const navigate = useNavigate();
    const location = useLocation();
    const nomeUser = location.state?.nome;
    const [materias, setMaterias] = useState([]);

    const carregarMaterias = async () => {
        try {
            const response = await axios.get("/dadosJson/materias.json");
            setMaterias(response.data);
        } catch (error) {
            console.error("Erro ao carregar matérias", error);
        }
    }

    useEffect(() => {
        carregarMaterias();
    }, []);

    return (
        <div className={Style.containerHomeAluno}>
            {/* Parte de Cima da Tela */}
            <div className={Style.tituloHomeAluno}>
                <div className={Style.badgeHomeAluno}>
                    <i className="fa-solid fa-certificate"></i>
                    <p>Olá, {nomeUser}!</p>
                </div>
                <h1>Escolha uma matéria para estudar</h1>
                <p>Cada matéria tem sua própria trilha, missões e conquistas.</p>
            </div>
            {/* Parte de Baixo da Tela */}
            <div className={Style.divMaterias}>
                {materias.map(materia => (
                    <div
                        key={materia.id}
                        className={Style.cardMateria}
                        onClick={() => {
                            navigate(`/aluno/${materia.nome}`, {
                                state: {
                                    idMateria: materia.id
                                }
                            });
                        }}
                    >
                        <div className={Style.iconeMateria}
                            style={{ backgroundColor: materia.background }}
                        >
                            <i className={`fa-solid fa-${materia.icone}`}></i>
                        </div>
                        <h2 className={Style.tituloMateria}>{materia.nome}</h2>
                        <div className={Style.badgeCard}>
                            <p>Estudar</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}