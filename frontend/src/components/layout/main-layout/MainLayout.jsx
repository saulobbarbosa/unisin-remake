import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import Style from "./mainLayout.module.css";

// Import dos Componentes
import HeaderAluno from "../header-aluno/HeaderAluno";
import HeaderAdmin from "../header-admin/HeaderAdmin";

export default function TelaLayout() {
    const navigate = useNavigate();
    const mainRef = useRef(null);

    // Verifica se User está logado
    const [userLogado, setUserLogado] = useState(null);
    const [tipoUsuario, setTipoUsuario] = useState(null);

    useEffect(() => {
        try {
            const idPessoa = localStorage.getItem("id");
            const tipo = localStorage.getItem("tipo");
            if (idPessoa !== null && tipo !== null) {
                setUserLogado(true);
                setTipoUsuario(tipo);
            } else {
                setUserLogado(false);
                navigate("/", { replace: true });
            }
        } catch (error) {
            console.error("Erro ao verificar login", error);
            setUserLogado(false);
            navigate("/", { replace: true });
        }
    }, [navigate]);

    // Enquanto verifica o login, não renderiza o layout
    if (!userLogado || userLogado === null) {
        return null;
    }

    return (
        <div className={Style.container}>
            {/* Topo fixo */}
            {tipoUsuario === "aluno" ? (
                <HeaderAluno />
            ) : (
                <HeaderAdmin />
            )}
            {/* Conteúdo dinâmico */}
            <main className={`${Style.main}`}>
                <div ref={mainRef} className={Style.scrollArea}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}