import React from "react";

import Style from "./conquistaRecente.module.css";

export default function CompConquistaRescente() {
    return (
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
    );
}