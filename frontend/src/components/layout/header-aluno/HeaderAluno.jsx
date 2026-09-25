import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Style from "./headerAluno.module.css";

import BarraLateral from "../barra-lateral/BarraLateral";

export default function CompHeader() {
    const navigate = useNavigate();
    const [barraAberta, setBarraAberta] = useState(false);

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
                    <span>Nível 1</span>
                </div>

                <div className={Style.moedas}>
                    <i className="fa-solid fa-link"></i>
                    <span>500</span>
                </div>

                <div className={Style.usuario}
                    onClick={() => { setBarraAberta(true) }}
                >
                    <div className={Style.avatar}>
                        <i className="fa-regular fa-user"></i>
                    </div>
                    <p>Leonardo</p>
                </div>
            </div>

            {/* Parte da Slide Bar */}
            <BarraLateral barraAberta={barraAberta} setBarraAberta={setBarraAberta} />
        </div>
    );
}