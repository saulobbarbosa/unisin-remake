import React, { useState, useEffect } from "react";

import Style from "./header.module.css";

// Import de Componentes
import Login from "../../forms/Login";
import Cadastro from "../../forms/Cadastro";

export default function CompHeaderHome() {
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);

    // Parte de mudar o css quando scrollar]
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={`${Style.containerHeader} ${scrolled ? Style.headerScrollado : ""}`}>
            <a href="#home">
                <div className={Style.divLogotipo}>
                    <div className={Style.iconCap}>
                        <i className="fa-solid fa-graduation-cap"
                            style={{ fontSize: "1.25rem", color: "#fff" }}
                        ></i>
                    </div>
                    <h1>UNISIN</h1>
                </div>
            </a>
            <div className={Style.divNavegacao}>
                <a href="#home"><h3>Home</h3></a>
                <a href="#materias"><h3>Matérias</h3></a>
                <a href="#sobre"><h3>Sobre Nós</h3></a>
                <a href="#beneficios"><h3>Benefícios</h3></a>
            </div>
            <div className={Style.divBtns}>
                <button onClick={() => setMostrarLogin(true)}>
                    <p>Login</p>
                </button>
                <button className={Style.btnCadastro}
                    onClick={() => setMostrarCadastro(true)}
                >
                    <p>Cadastro</p>
                </button>
            </div>
            {/* FORMULÁRIO DE LOGIN */}
            {mostrarLogin && (
                <Login
                    fechar={() => setMostrarLogin(false)}
                />
            )}
            {/* FORMULÁRIO DE CADASTRO */}
            {mostrarCadastro && (
                <Cadastro
                    fechar={() => setMostrarCadastro(false)}
                    entrar={() => {
                        setMostrarCadastro(false);
                        setMostrarLogin(true);
                    }}
                />
            )}
        </div>
    );
}