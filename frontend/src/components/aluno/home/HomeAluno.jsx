import React from "react";
import { useNavigate } from "react-router-dom";

import Style from "./homeAluno.module.css";

export default function TelaHomeAluno() {
    const navigate = useNavigate();

    const materias = [
        {
            id: 1,
            nome: "Matemática",
            icone: "calculator",
            background: "#006bed",
            rota: "amigos"
        },
        {
            id: 2,
            nome: "Português",
            icone: "book",
            background: "#16A34A",
            rota: "home-aluno"
        },
        {
            id: 3,
            nome: "Inglês",
            icone: "language",
            background: "#7C3AED",
            rota: "home-aluno"
        },
        {
            id: 4,
            nome: "História",
            icone: "landmark",
            background: "#EA580C",
            rota: "home-aluno"
        },
        {
            id: 5,
            nome: "Geografia",
            icone: "globe",
            background: "#0891B2",
            rota: "home-aluno"
        },
        {
            id: 6,
            nome: "Química",
            icone: "flask",
            background: "#059669",
            rota: "home-aluno"
        },
        {
            id: 7,
            nome: "Física",
            icone: "compass-drafting",
            background: "#1E3A8A",
            rota: "home-aluno"
        },
        {
            id: 8,
            nome: "Artes",
            icone: "palette",
            background: "#DC2626",
            rota: "home-aluno"
        },
        {
            id: 9,
            nome: "Educação Física",
            icone: "volleyball",
            background: "#0F766E",
            rota: "home-aluno"
        }
    ];

    return (
        <div className={Style.containerHomeAluno}>
            <div className={Style.conteudoHomeAluno}>
                {/* Parte de Cima da Tela */}
                <div className={Style.tituloHomeAluno}>
                    <div className={Style.badgeHomeAluno}>
                        <i className="fa-solid fa-certificate"></i>
                        <p>Olá, Leonardo!</p>
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
                            onClick={()=>{
                                navigate(`/${materia.rota}`);
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
        </div>
    );
}