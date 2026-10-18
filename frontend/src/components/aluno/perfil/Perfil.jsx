import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./perfil.module.css";

export default function TelaPerfil() {
    const [dadosUser, setDadosUser] = useState([]);

    // Estrutura de Dados para pegar matérias
    const materias = [
        {
            id: 1,
            nome: "Matemática",
            icone: "calculator",
            background: "#006bed",
        },
        {
            id: 2,
            nome: "Português",
            icone: "book",
            background: "#16A34A",
        },
        {
            id: 3,
            nome: "Inglês",
            icone: "language",
            background: "#7C3AED",
        },
        {
            id: 4,
            nome: "História",
            icone: "landmark",
            background: "#EA580C",
        },
        {
            id: 5,
            nome: "Geografia",
            icone: "globe",
            background: "#0891B2",
        },
        {
            id: 6,
            nome: "Química",
            icone: "flask",
            background: "#059669",
        },
        {
            id: 7,
            nome: "Física",
            icone: "compass-drafting",
            background: "#1E3A8A",
        },
        {
            id: 8,
            nome: "Artes",
            icone: "palette",
            background: "#DC2626",
        },
        {
            id: 9,
            nome: "Educação Física",
            icone: "volleyball",
            background: "#0F766E",
        }
    ];


    // Função para carregar os dados do usuario
    const carregarDados = async () => {
        try {
            const response = await axios.get("/dadosJson/usuarios.json");
            const idUser = localStorage.getItem("id");
            const usuario = response.data.find(u => String(u.id) === String(idUser));
            if (!usuario) {
                console.error("Usuário não encontrado para o ID:", idUser);
                return;
            }
            setDadosUser(usuario);
        } catch (error) {
            console.error("Erro ao Carregar dados", error);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    return (
        <div className={Style.containerPerfil}>
            {/* Banner da Matéria */}
            <div className={Style.banner}
                style={{ background: dadosUser.fundo }}
            >
                <div className={Style.informacaoUser}>
                    <img src={dadosUser.avatar} alt="Avatar"
                        style={{ border: `0.2rem solid ${dadosUser.borda}` }}
                    />
                    <div className={Style.textoInfo}>
                        <h1>{dadosUser.nome}</h1>
                        <div className={Style.blocosInfo}>
                            <div className={Style.nivel}>
                                <i className="fa-solid fa-star"></i>
                                <span>Nível {dadosUser.nivel}</span>
                            </div>
                            <div className={Style.moedas}>
                                <img src={require('../../../imgs/moeda.png')} alt="Icon de Moeda" />
                                <span>{dadosUser.moedas}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button className={Style.btnEditarPerfil}>
                    <i class="fa-solid fa-pencil"></i>
                    <p>Editar Perfil</p>
                </button>
            </div>
            {/* Parte que Mostra as Matérias e as Conquistas */}
            <div className={Style.configParteBaixo}>
                {/* Parte de Exibir as Matérias */}
                <div className={Style.containerMateria}>
                    <h1>Progresso nas matérias</h1>
                    <div className={Style.divExibirMateria}>
                        {materias.map(materia => (
                            <div key={materia.id} className={Style.divMateria}>
                                <div className={Style.iconeMateria}
                                    style={{ backgroundColor: materia.background }}
                                >
                                    <i className={`fa-solid fa-${materia.icone}`}></i>
                                </div>
                                <div className={Style.infoMateria}>
                                    <h2>{materia.nome}</h2>
                                    <div className={Style.barraProgresso}>
                                        <div
                                            className={Style.progressoPreenchido}
                                            style={{ width: "50%" }}
                                        ></div>
                                    </div>
                                    <p>0% concluído</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Parte de Exibir as Conquistas */}
                <div className={Style.divConquistas}>
                    <div className={Style.tituloConquista}>
                        <i className="fa-solid fa-trophy"></i>
                        <h1>Conquistas Recentes</h1>
                    </div>
                    <div className={Style.listaConquistas}>
                        {/* Array Map aqui */}
                        <div className={Style.blocoConquista}>
                            <p>🥉</p>
                            <div className={Style.infoConquista}>
                                <h1>Primeiros passos</h1>
                                <p>Conclua sua primeira missão.</p>
                            </div>
                        </div>
                        <div className={Style.blocoConquista}>
                            <p>🧮</p>
                            <div className={Style.infoConquista}>
                                <h1>Calculista</h1>
                                <p>Acerte 20 questões.</p>
                            </div>
                        </div>
                        <div className={Style.blocoConquista}>
                            <p>🏅</p>
                            <div className={Style.infoConquista}>
                                <h1>Mestre da Matemática</h1>
                                <p>Resolva 100 questões.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}