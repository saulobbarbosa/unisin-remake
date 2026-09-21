import React from "react";
import Style from "./HeaderAmigos.module.css";

export default function HeaderAmigos() {
    return (
        <header className={Style.header}>

            <div className={Style.logo}>
                <div className={Style.logoIcon}>
                    <i className="fa-solid fa-graduation-cap"></i>
                </div>

                <h2>UNISIN</h2>
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

                <div className={Style.usuario}>
                    <div className={Style.avatar}>
                        <i className="fa-regular fa-user"></i>
                    </div>

                    <span>Leonardo</span>
                </div>

            </div>

        </header>
    );
}