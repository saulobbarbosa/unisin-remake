//import React, { useState, useEffect } from "react";
//import axios from "axios";

import Style from "./inventario.module.css";

export default function TelaInventario() {
    return (
        <div className={Style.containerInventario}>
            <div className={Style.tituloInventario}>
                <i className="fa-solid fa-suitcase-rolling"></i>
                <h1>Inventário</h1>
            </div>
            <div className={Style.divInventarioPreview}>
                <div className={Style.divPreview}>
                    <div className={Style.preview}>
                        <img src="" alt="" />
                        <h1></h1>
                    </div>
                    <div className={Style.divEquipadosTexto}>
                        <div className={Style.tipo}>
                            <p>Avatar</p>
                            <p>Borda</p>
                            <p>Fundo</p>
                            <p>Título</p>
                        </div>
                        <div className={Style.item}>
                            <p>---</p>
                            <p>---</p>
                            <p>---</p>
                            <p>---</p>
                        </div>
                    </div>
                </div>
                <div className={Style.divInventario}>
                    
                </div>
            </div>
        </div>
    );
}