import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

import Style from "./headerAdmin.module.css";

export default function CompHeader() {
    const navigate = useNavigate();
    let tipoUser = localStorage.getItem("tipo");

    // Função Logout
    const logout = () => {
        try {
            localStorage.removeItem("id");
            localStorage.removeItem("tipo");
            tipoUser = null;
            navigate("/");
        } catch (error) {
            console.error("Erro ao Realizar logout", error);
        }
    }

    const alertSair = () => {
        Swal.fire({
            title: "Quer Realmente Sair?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sim, Quero Sair!",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#012663"
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            }
        });
    }

    return (
        <div className={Style.header}>
            <div className={Style.divLogotipo} onClick={() => {
                navigate(tipoUser === "professor" ? "/home-prof" : "/home-escola");
            }}>
                <div className={Style.iconCap}>
                    <i className="fa-solid fa-graduation-cap"
                        style={{ fontSize: "1.25rem", color: "#fff" }}
                    ></i>
                </div>
                <div className={Style.divLogotipoTexto}>
                    <h1>UNISIN</h1>
                    <p>Área {tipoUser === "professor" ? "do Professor" : "da Escola"}</p>
                </div>
            </div>

            <div className={Style.infoUsuario}>
                <p>Colégio Exemplo</p>
                <div className={Style.btnSair}
                    onClick={() => { alertSair() }}
                >
                    <div className={Style.iconMenu}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </div>
                    <p>Sair</p>
                </div>
            </div>
        </div>
    );
}