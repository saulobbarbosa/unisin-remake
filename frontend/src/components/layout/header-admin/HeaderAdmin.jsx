import React from "react";

import Style from "./headerAdmin.module.css";

export default function CompHeaderAdmin({ usuario, logout }) {
    return (
        <div className={Style.header}>
            <div className={Style.divLogotipo}>
                <div className={Style.iconCap}>
                    <i className="fa-solid fa-graduation-cap"
                        style={{ fontSize: "1.25rem", color: "#fff" }}
                    ></i>
                </div>
                <div className={Style.divLogotipoTexto}>
                    <h1>UNISIN</h1>
                    <p>Área {usuario.tipo === "professor" ? "do Professor" : "da Escola"}</p>
                </div>
            </div>
            <div className={Style.infoUsuario}>
                <p>{usuario.nome}</p>
                <div className={Style.btnSair}
                    onClick={() => { logout() }}
                >
                    <div className={Style.iconMenu}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </div>
                    <p>Sair</p>
                </div>
            </div>
        </div>
    );
}