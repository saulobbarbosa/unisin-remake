import React from "react";

import Style from "./lobby.module.css";

export default function TelaLobby() {
    return (
        <div className={Style.containerLobby}>
            <div className={Style.tituloLobby}>
                <i className="fa-solid fa-shield"></i>
                <h1>Lobby PvP</h1>
            </div>
            <div className={Style.divApresentacao}>
                <div className={Style.mostrarUser}>
                    <div className={Style.cardUser}>
                        <div className={Style.avatar}>
                            <img src="/imgs/boy_black.webp" alt="Avatar Usuário"
                                style={{ border: "0.3rem solid tomato" }}
                            />
                        </div>
                        <div className={Style.texto}>
                            <h1>Leonardo</h1>
                            <p>Nv. 1</p>
                            <span
                                style={{ padding: "0.5rem 1rem", color: "yellow" }}
                            >Aguardando...</span>
                        </div>
                    </div>
                    <h1>VS</h1>
                    <div className={Style.cardUser}>
                        <div className={Style.avatar}>
                            <img src="/imgs/girl_black.webp" alt="Avatar Usuário"
                                style={{ border: "0.3rem solid tomato" }}
                            />
                        </div>
                        <div className={Style.texto}>
                            <h1>Marina</h1>
                            <p>Nv. 12</p>
                            <span
                                style={{ padding: "0.5rem 1rem", color: "green" }}
                            >Pronto</span>
                        </div>
                    </div>
                </div>
                <div className={Style.divBtnAcao}>
                    <button>
                        <p>Estou Pronto</p>
                    </button>
                    {/* <button>
                        <i className="fa-solid fa-check"></i>
                        <p>Pronto!</p>
                    </button> */}
                    <button>
                        <i className="fa-solid fa-play"></i>
                        <p>Iniciar Duelo</p>
                    </button>
                    <button>
                        <i className="fa-solid fa-x"></i>
                        <p>Sair do PvP</p>
                    </button>
                </div>
            </div>
        </div>
    );
}