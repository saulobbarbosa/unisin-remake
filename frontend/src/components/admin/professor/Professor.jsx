// import React, { useState, useEffect } from "react";
// import axios from "axios";

import Style from "./professor.module.css";

export default function TelaEscola() {
    return (
        <div className={Style.containerProfessor}>
            <div className={Style.divTitulo}>
                <div>
                    <div className={Style.divIconAtividade}>
                        <i className="fa-solid fa-clipboard-list"></i>
                        <h1>Atividades</h1>
                    </div>
                    <p className={Style.paragrafoTitulo}>
                        Acompanhe as entregas dos alunos.
                    </p>
                </div>
                <button className={Style.btnCadastrar}>
                    <p>+ Nova Atividade</p>
                </button>
            </div>
            <div className={Style}>
                
            </div>
        </div>
    );
}