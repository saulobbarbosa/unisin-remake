import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Style from "./perfil.module.css";

import ConquistaRescente from "../conquista-recente/ConquistaRecente";

export default function TelaPerfil() {
    const [dadosUser, setDadosUser] = useState([]);
    const [materias, setMaterias] = useState([]);
    const { alunoId } = useParams();

    useEffect(() => {
        const carregarMaterias = async () => {
            try {
                const response = await axios.get("/dadosJson/materias.json");
                setMaterias(response.data);
            } catch (error) {
                console.error("Erro ao carregar matérias", error);
            }
        }

        const carregarDados = async () => {
            try {
                const response = await axios.get("/dadosJson/usuarios.json");
                const usuario = response.data.find(u => String(u.id) === String(alunoId));
                if (!usuario) {
                    console.error("Usuário não encontrado para o ID:", alunoId);
                    return;
                }
                setDadosUser(usuario);
            } catch (error) {
                console.error("Erro ao Carregar dados", error);
            }
        }

        carregarDados();
        carregarMaterias();
    }, [alunoId]);

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
                        <p>{dadosUser?.titulo ? `# ${dadosUser.titulo}` : ""}</p>
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
                <ConquistaRescente />
            </div>
        </div>
    );
}