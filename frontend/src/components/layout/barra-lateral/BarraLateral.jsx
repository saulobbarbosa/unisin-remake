import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

import Style from "./barraLateral.module.css";

export default function CompBarraLateral({ barraAberta, setBarraAberta }) {
    const navigate = useNavigate();
    const barraRef = useRef(null);

    // Função de Trocar Telas
    const navegar = (rota) => {
        setBarraAberta(false);
        navigate(rota);
    }

    // Função Logout
    const logout = () => {
        try {
            localStorage.removeItem("id");
            localStorage.removeItem("tipo");
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

    // Ref para fechar a Barra caso clicar fora dela
    useEffect(() => {
        const handleClickFora = (e) => {
            if (e.target.closest(".swal2-container")) {
                return;
            }

            if (barraRef.current && !barraRef.current.contains(e.target)) {
                setBarraAberta(false);
            };
        }
        if (barraAberta) {
            document.addEventListener("mousedown", handleClickFora);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickFora);
        };
    }, [barraAberta, setBarraAberta]);

    return (
        <div className={`
            ${Style.overlayBarraLateral}
            ${barraAberta ? Style.aberta : Style.fechada}
        `}>
            <div className={Style.containerBarraLateral} ref={barraRef}>
                <div className={Style.divUsuarioBarra}>
                    <div className={Style.avatar}>
                        <i className="fa-regular fa-user"></i>
                    </div>
                    <div className={Style.divUsuarioTexto}>
                        <h2>Leonardo</h2>
                        <p>Nível 1 • 500 Moedas</p>
                    </div>
                    <i className="fa-solid fa-x" style={{
                        fontSize: "0.875rem",
                        color: "#64748b",
                        cursor: "pointer"
                    }}
                        onClick={() => { setBarraAberta(false) }}
                    ></i>
                </div>
                <div className={Style.divMenuBarraLateral}>
                    <div className={Style.itemMenu}
                        onClick={() => { navegar("/home-aluno") }}
                    >
                        <div className={Style.iconMenu}>
                            <i className="fa-solid fa-house"></i>
                        </div>
                        <p>Home</p>
                    </div>
                    <div className={Style.itemMenu}
                        onClick={() => { navegar("/amigos") }}
                    >
                        <div className={Style.iconMenu}>
                            <i className="fa-solid fa-user-group"></i>
                        </div>
                        <p>Amigos</p>
                    </div>
                    <div className={Style.itemMenu}
                        onClick={() => { navegar("/loja") }}
                    >
                        <div className={Style.iconMenu}>
                            <i className="fa-solid fa-shop"></i>
                        </div>
                        <p>Loja</p>
                    </div>
                    <div className={Style.itemMenu}
                        onClick={() => { navegar("/inventario") }}
                    >
                        <div className={Style.iconMenu}>
                            <i className="fa-solid fa-suitcase-rolling"></i>
                        </div>
                        <p>Inventário</p>
                    </div>
                    <div className={Style.itemMenu}
                        onClick={() => { navegar("/conquistas") }}
                    >
                        <div className={Style.iconMenu}>
                            <i className="fa-solid fa-trophy"></i>
                        </div>
                        <p>Conquistas</p>
                    </div>
                    <div className={Style.itemMenu}
                        onClick={() => { navegar("/ranking") }}
                    >
                        <div className={Style.iconMenu}>
                            <i className="fa-solid fa-medal"></i>
                        </div>
                        <p>Ranking</p>
                    </div>
                    <div className={Style.itemMenu}
                        onClick={() => { navegar("/perfil") }}
                    >
                        <div className={Style.iconMenu}>
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <p>Perfil</p>
                    </div>
                    <div className={Style.itemMenu + " " + Style.itemMenuSair}
                        onClick={() => { alertSair() }}
                    >
                        <div className={Style.iconMenu}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </div>
                        <p>Sair</p>
                    </div>
                </div>
            </div>
        </div>
    );
}