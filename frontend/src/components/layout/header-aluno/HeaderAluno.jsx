import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Style from "./headerAluno.module.css";

import BarraLateral from "../barra-lateral/BarraLateral";

export default function CompHeaderAluno({ usuario, logout }) {
    const navigate = useNavigate();
    const [barraAberta, setBarraAberta] = useState(false);
   
    return (
        <div className={Style.header}>
            <div className={Style.divLogotipo} onClick={() => { navigate("/aluno/home") }}>
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
                    <span>Nível {usuario?.nivel_ensino}</span>
                </div>
                <div className={Style.moedas}>
                    <img src={require('../../../imgs/moeda.png')} alt="Icon de Moeda" />
                    <span>{usuario?.moedas}</span>
                </div>
                <div className={Style.usuario}
                    onClick={() => { setBarraAberta(true) }}
                >
                    <img src={usuario?.avatar || "/imgs/boy_black.webp"} alt="Avatar"
                        className={Style.avatar}
                        style={{ border: `0.188rem solid ${usuario?.borda || "#000"}` }}
                    />
                    <p>{usuario?.nome || "Usuário"}</p>
                </div>
            </div>

            {/* Parte da Slide Bar */}
            <BarraLateral
                barraAberta={barraAberta}
                setBarraAberta={setBarraAberta}
                dadosUser={usuario}
                logout={logout}
            />
        </div>
    );
}