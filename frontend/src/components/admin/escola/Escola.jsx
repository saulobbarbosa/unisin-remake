// import React, { useState, useEffect } from "react";
// import axios from "axios";

import Style from "./escola.module.css";

export default function TelaEscola() {
    return (
        <div className={Style.containerEscola}>
            <div className={Style.divTitulo}>
                <div>
                    <div className={Style.divIconProfessor}>
                        <i className="fa-solid fa-user-group"></i>
                        <h1>Professores</h1>
                    </div>
                    <p className={Style.paragrafoTitulo}>
                        Gerencie o corpo docente da sua instituição.
                    </p>
                </div>
                <button className={Style.btnCadastrar}>
                    <p>+ Cadastrar Professor</p>
                </button>
            </div>
            <div className={Style.divCardsProfessores}>
                <div>
                    <div></div>
                    <p></p>
                    <p></p>
                    <p></p>
                    <div>
                        <button><p>Editar</p></button>
                        <button><p>Remover</p></button>
                    </div>
                </div>
            </div>
        </div>
    );
}