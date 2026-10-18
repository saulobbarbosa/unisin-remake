import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./perfil.module.css";

export default function TelaPerfil() {
    const [dadosUser, setDadosUser] = useState([]);

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
        </div>
    );
}