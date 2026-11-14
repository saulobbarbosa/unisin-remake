import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./ranking.module.css";

export default function TelaRanking() {
    const [menuRank, setMenuRank] = useState("humanas");
    const [rankHumanas, setRankHumanas] = useState([]);
    const [rankExatas, setRankExatas] = useState([]);
    const nomeUser = localStorage.getItem("nomeUser");

    // Definir Array a ser Descarregado pelo map
    const rankingAtual = menuRank === "humanas" ? rankHumanas : rankExatas;

    useEffect(() => {
        const carregarRankHumanas = async () => {
            try {
                const response = await axios.get("/dadosJson/ranking.json");
                setRankHumanas(response.data.humanas);
            } catch (error) {
                console.error("Erro ao Buscar dados do Rank de Humanas", error);
            }
        }
        const carregarRankExatas = async () => {
            try {
                const response = await axios.get("/dadosJson/ranking.json");
                setRankExatas(response.data.exatas);
            } catch (error) {
                console.error("Erro ao Buscar dados do Rank de Exatas", error);
            }
        }

        carregarRankHumanas();
        carregarRankExatas();
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
                    ${menuRank === "humanas" ? Style.menuAtivo : ""}
                `}
                    onClick={() => { setMenuRank("humanas") }}
                >
                    <p>Humanas</p>
                </button>
                <button className={`
                    ${Style.btnMenu}
                    ${menuRank === "exatas" ? Style.menuAtivo : ""}
                `}
                    onClick={() => { setMenuRank("exatas") }}
                >
                    <p>Exatas</p>
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
                            <div className={Style.nomeNivel}>
                                <h1>
                                    {item.nome}{" "}
                                    {item.nome === nomeUser ? "(você)" : ""}
                                </h1>
                                <p className={Style.nivel}>
                                    <i class="fa-solid fa-star"></i>{" "}
                                    Nv. {item.nivel}
                                </p>
                            </div>
                        </div>
                        <div className={Style.moedas}>
                            <img src={require('../../../imgs/moeda.png')} alt="Icon de Moeda" />
                            <span>{item.moedas}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}