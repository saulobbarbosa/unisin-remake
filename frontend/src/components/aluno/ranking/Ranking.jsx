import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./ranking.module.css";

export default function TelaRanking() {
    const [menuRank, setMenuRank] = useState("moedas");
    const [rankMoedas, setRankMoedas] = useState([]);
    const [rankNivel, setRankNivel] = useState([]);
    const nomeUser = localStorage.getItem("nomeUser");

    // Definir Array a ser Descarregado pelo map
    const rankingAtual = menuRank === "moedas" ? rankMoedas : rankNivel;

    useEffect(() => {
        const carregarRankMoedas = async () => {
            try {
                const response = await axios.get("/dadosJson/ranking.json");
                setRankMoedas(response.data.moedas);
            } catch (error) {
                console.error("Erro ao Buscar dados do Rank de Moedas", error);
            }
        }
        const carregarRankNivel = async () => {
            try {
                const response = await axios.get("/dadosJson/ranking.json");
                setRankNivel(response.data.nivel);
            } catch (error) {
                console.error("Erro ao Buscar dados do Rank de Nível", error);
            }
        }

        carregarRankMoedas();
        carregarRankNivel();
    }, []);

    return (
        <div className={Style.containerRanking}>
            <div className={Style.tituloRanking}>
                <i className="fa-solid fa-ranking-star"></i>
                <h1>Ranking</h1>
            </div>
            <div className={Style.menuTrocarRanking}>
                <button className={`
                    ${Style.btnMenu}
                    ${menuRank === "moedas" ? Style.menuAtivo : ""}
                `}
                    onClick={() => { setMenuRank("moedas") }}
                >
                    <p>Moedas</p>
                </button>
                <button className={`
                    ${Style.btnMenu}
                    ${menuRank === "nivel" ? Style.menuAtivo : ""}
                `}
                    onClick={() => { setMenuRank("nivel") }}
                >
                    <p>Nível</p>
                </button>
            </div>
            <div className={Style.divListagem}>
                {rankingAtual.map((item, index) => (
                    <div key={item.id} className={`
                        ${Style.cardUser}
                        ${item.nome === nomeUser ? Style.cardUserAtivo : ""}
                    `}>
                        <div className={Style.posicao}>
                            <p>{index + 1}</p>
                        </div>
                        <div className={Style.infoUser}>
                            <img src={item.avatar} alt="Imagem de Avatar do Usuário"
                                style={{ border: `0.2rem solid ${item.borda}` }}
                            />
                            <h1>
                                {item.nome}{" "}
                                {item.nome === nomeUser ? "(você)" : ""}
                            </h1>
                        </div>
                        <div className={Style.moedasNivel}>
                            {menuRank === "moedas" ? (
                                <>
                                    <img src={require('../../../imgs/moeda.png')} alt="Icon de Moeda"
                                        className={Style.imgMoeda}
                                    />
                                    <span>{item.moedas}</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-star"></i>{" "}
                                    <p>Nv. {item.nivel}</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}