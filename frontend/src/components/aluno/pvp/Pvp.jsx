import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

import Style from "./pvp.module.css";

// import de componente
// import Responder from "../responder/Responder";

export default function TelaPvp() {
    // const navigate = useNavigate();
    // const location = useLocation();
    // const { idUser, adversarioId } = location.state || {};
    const [dadosUser, setDadosUser] = useState([]);
    const [dadosOponente, setDadosOponente] = useState([]);

    // Carregar dados Principais quando renderizar componente
    const { idUser, adversarioId } = useParams();
    useEffect(() => {
        
        const carregarDados = async () => {
            try {
                const response = await axios.get("/dadosJson/usuarios.json");
                const usuario = response.data.find(u => String(u.id) === String(idUser));
                const oponente = response.data.find(u => String(u.id) === String(adversarioId));
                if (!usuario || !oponente) {
                    console.error("Usuário não encontrado");
                    return;
                }
                setDadosUser(usuario);
                setDadosOponente(oponente);
            } catch (error) {
                console.error("Erro ao Carregar dados", error);
            }
        }
        carregarDados();
    }, [idUser, adversarioId]);

    return (
        <div className={Style.containerPvp}>
            <div className={Style.tituloPvp}>
                <i className="fa-solid fa-khanda"></i>
                <h1>PvP</h1>
            </div>
            <div className={Style.divPontuacao}>
                <div className={Style.divPlayer}>
                    <div className={Style.player}>
                        <img src={dadosUser.avatar} alt="Avatar Player"
                            style={{ border: `0.2rem solid ${dadosUser.borda}` }}
                        />
                        <div className={Style.textoPlayer}>
                            <h1>{dadosUser.nome}</h1>
                            <p>{"0"} acertos</p>
                        </div>
                    </div>
                    <div className={Style.barraProgresso}></div>
                </div>
                <h1 className={Style.versus}>VS</h1>
                <div className={Style.divPlayer}>
                    <div className={Style.player}>
                        <img src={dadosOponente.avatar} alt="Avatar Player"
                            style={{ border: `0.2rem solid ${dadosOponente.borda}` }}
                        />
                        <div className={Style.textoPlayer}>
                            <h1>{dadosOponente.nome}</h1>
                            <p>{"0"} acertos</p>
                        </div>
                    </div>
                    <div className={Style.barraProgresso}></div>
                </div>
            </div>
            <h1 className={Style.qtdPerguntas}>Pergunta {"1"} de {"5"}</h1>
        </div>
    );
}