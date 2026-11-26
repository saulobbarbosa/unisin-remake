import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

import Style from "./mainLayout.module.css";

import { conectarSocket } from "../../../services/socket";

// Import dos Componentes
import HeaderAluno from "../header-aluno/HeaderAluno";
import HeaderAdmin from "../header-admin/HeaderAdmin";

export default function TelaLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");

    // Dados do usuário logado
    const [usuario, setUsuario] = useState([]);
    // Enquanto verifica o login
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            if (!token) {
                navigate("/", { replace: true });
                return;
            }
            try {
                const response = await axios.get("/api/usuarios/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const dadosUsuario = response.data;
                if (!dadosUsuario) {
                    console.log("Usuário não encontrado");
                }
                // Guarda os dados do usuário
                setUsuario(dadosUsuario);
                localStorage.setItem("id", dadosUsuario.id_usuario);
                localStorage.setItem("nomeUser", dadosUsuario.nome);
                // Conectar ao Socket.IO
                conectarSocket(dadosUsuario.id_usuario);
            } catch (error) {
                console.error("Erro ao Buscar Dados", error);
                localStorage.removeItem("token");
                navigate("/", { replace: true });
            } finally {
                setCarregando(false);
            }
        }
        carregarDados();
    }, [navigate, token]);

    // Verifica se está na rota de configuração
    useEffect(() => {
        if (!usuario || location.pathname !== "/configuracao") {
            return;
        }
        if (usuario.tipo === "aluno") {
            navigate("/aluno/home", { replace: true });
        } else if (usuario.tipo === "professor") {
            navigate("/home-prof", { replace: true });
        } else if (usuario.tipo === "escola") {
            navigate("/home-escola", { replace: true });
        } else {
            console.error("Tipo de usuário inválido:", usuario.tipo);
            localStorage.removeItem("token");
            navigate("/", { replace: true });
        }
    }, [usuario, navigate, location.pathname]);

    // Função Logout
    const logout = async () => {
        try {
            if(!token){
                return;
            }
            await axios.post("/api/auth/logout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            localStorage.removeItem("nomeUser");
            setUsuario(null);
            navigate("/", { replace: true });
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

    // Enquanto verifica o usuário
    if (carregando || !usuario || location.pathname === "/configuracao") {
        return null;
    }

    return (
        <div className={Style.container}>
            {/* Topo fixo */}
            {usuario.tipo === "aluno" ? (
                <HeaderAluno
                    usuario={usuario}
                    logout={alertSair}
                />
            ) : (
                <HeaderAdmin
                    usuario={usuario}
                    logout={alertSair}
                />
            )}
            {/* Conteúdo dinâmico */}
            <main className={Style.main}>
                <Outlet />
            </main>
        </div>
    );
}