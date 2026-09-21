import React, { useState } from "react";
import HeaderAmigos from "./HeaderAmigos";
import Style from "./Amigos.module.css";
import amigos from "./dadosAmigos";


export default function Amigos() {
    const [aba, setAba] = useState("amigos");

    return (
        <div className={Style.pagina}>
            <HeaderAmigos />

            <main className={Style.conteudo}>
                {/* CABECALHO DA PÁGINA */}
                <div className={Style.tituloArea}>
                    <div className={Style.titulo}>
                        <i className="fa-solid fa-user-group"></i>
                        <h1>Amigos</h1>
                    </div>

                    <div className={Style.acoes}>
                        <button className={Style.btnSolicitacoes}>
                            <i className="fa-regular fa-envelope"></i>
                            Solicitações
                            <span>2</span>
                        </button>

                        <button className={Style.btnAdicionar}>
                            <i className="fa-solid fa-user-plus"></i>
                            Adicionar
                        </button>
                    </div>
                </div>

                {/* ABAS */}
                <div className={Style.abas}>
                    <button
                        className={aba === "amigos" ? Style.abaAtiva : ""}
                        onClick={() => setAba("amigos")}
                    >
                        Meus amigos ({amigos.length})
                    </button>

                    <button
                        className={aba === "solicitacoes" ? Style.abaAtiva : ""}
                        onClick={() => setAba("solicitacoes")}
                    >
                        Solicitações (2)
                    </button>
                </div>

                {/* LISTA */}
                {aba === "amigos" && (
                    <div className={Style.lista}>
                        {amigos.map(amigo => (
                            <div key={amigo.id} className={Style.cardAmigo}>
                                <div className={Style.avatarAmigo}>
                                    {amigo.avatar}
                                </div>

                                <div className={Style.infoAmigo}>
                                    <h3>{amigo.nome}</h3>
                                    <div className={Style.status}>
                                        <span className={Style.nivelAmigo}>
                                            <i className="fa-solid fa-star"></i>
                                            Nv. {amigo.nivel}
                                        </span>
                                        <span className={Style.moedasAmigo}>
                                            <i className="fa-solid fa-link"></i>
                                            {amigo.moedas}
                                        </span>
                                    </div>
                                </div>

                                <button className={Style.btnMenu}>⋮</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
