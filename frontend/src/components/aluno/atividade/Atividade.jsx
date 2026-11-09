import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import Style from "./atividade.module.css";

// import de componente
import Responder from "../responder/Responder";

export default function TelaAtividade() {
    const navigate = useNavigate();
    const location = useLocation();
    const dadosState = location?.state || {};
    const { materia } = useParams();
    const [pergunta, setPergunta] = useState([]);

    useEffect(() => {
        const carregarAtividade = async () => {
            try {
                const response = await axios.get("/dadosJson/atividades.json");
                const atividade = response.data[materia]?.find(
                    (item) => item.id === Number(dadosState.idAtividade)
                );
                setPergunta(atividade);
            } catch (error) {
                console.error("Erro ao carregar dados da atividade", error);
            }
        }

        carregarAtividade();
    }, [materia, dadosState.idAtividade, navigate]);

    return (
        <div className={Style.containerAtividade}>
            {/* Botão para o User voltar para Trilha */}
            <button className={Style.btnVoltar} onClick={() => { navigate(-1) }}>
                <i className="fa-solid fa-arrow-left"></i>
                <p>Voltar à trilha</p>
            </button>
            <div className={Style.banner}
                style={{ background: dadosState.background }}
            >
                <h1>{materia}</h1>
            </div>
            <Responder pergunta={pergunta} />
        </div>
    );
}