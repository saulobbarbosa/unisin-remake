import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Style from "./headerAluno.module.css";

import BarraLateral from "../barra-lateral/BarraLateral";

export default function CompHeaderAluno() {
    const navigate = useNavigate();
    const [barraAberta, setBarraAberta] = useState(false);
    const [dadosHeader, setDadosHeader] = useState([]);

    const carregarDados = async () => {
        try {
            const response = await axios.get("/dadosJson/usuarios.json");
            const idUser = localStorage.getItem("id");
            const usuario = response.data.find(u => String(u.id) === String(idUser));
            if (!usuario) {
                console.error("Usuário não encontrado para o ID:", idUser);
                return;
            }
            setDadosHeader(usuario);
        } catch (error) {
            console.error("Erro ao Carregar dados do Header", error);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    return (
        <div className={Style.header}>
            <div className={Style.divLogotipo} onClick={() => { navigate("/home-aluno") }}>
                <div className={Style.iconCap}>
                    <i className="fa-solid fa-graduation-cap"
                        style={{ fontSize: "1.25rem", color: "#fff" }}
                    ></i>
                </div>
                <h1>UNISIN</h1>
            </div>

            <div className={Style.infoUsuario}>
                <div className={Style.nivel}>
                    <i className="fa-solid fa-star"></i>
                    <span>Nível {dadosHeader.nivel}</span>
                </div>

                <div className={Style.moedas}>
                    <i className="fa-solid fa-link"></i>
                    <span>{dadosHeader.moedas}</span>
                </div>

                <div className={Style.usuario}
                    onClick={() => { setBarraAberta(true) }}
                >
                    <div className={Style.avatar}>
                        <i className="fa-regular fa-user"></i>
                    </div>
                    <p>{dadosHeader.nome}</p>
                </div>
            </div>

            {/* Parte da Slide Bar */}
            <BarraLateral 
                barraAberta={barraAberta} 
                setBarraAberta={setBarraAberta}
                dadosUser={dadosHeader}
            />
        </div>
    );
}