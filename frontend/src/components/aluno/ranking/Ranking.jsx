import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./ranking.module.css";

export default function TelaRanking() {
    const [menuRank, setMenuRank] = useState("humanas");
    const [rankHumanas, setRankHumanas] = useState(null);
    const [rankExatas, setRankExatas] = useState(null);

    useEffect(() => {
        const carregarRankHumanas = async () => {
            try {
                const response = await axios.get("/dadosJson/ranking.json");
                setRankHumanas(response.humanas);
            } catch (error) {
                console.error("Erro ao Buscar dados do Rank de Humanas", error);
            }
        }
        const carregarRankExatas = async () => {
            try {
                const response = await axios.get("/dadosJson/ranking.json");
                setRankExatas(response.exatas);
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
        </div>
    );
}