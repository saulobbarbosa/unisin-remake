import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Style from "./login.module.css";

export default function CompLogin({ fechar, setMostrarCadastro }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const logar = async () => {
        try {
            const response = await axios.get("/dadosJson/usuarios.json");
            const usuario = response.data.find(u => u.email === email && u.senha === senha);
            if (usuario) {
                localStorage.setItem("id", usuario.id);
                navigate("/home-aluno");
            } else {
                alert("Login Invalido");
            }
        } catch (error) {
            console.error("Ocorreu um Erro", error);
        }
    }

    return (
        <div className={Style.overlay}>
            <div className={Style.modalLogin}>
                <button className={Style.btnFechar}
                    onClick={() => { fechar() }}
                >
                    <i className="fa-solid fa-x" style={{ fontSize: "1rem", color: "#000" }}></i>
                </button>

                <div className={Style.iconeUsuario}>
                    <i className="fa-solid fa-user"></i>
                </div>

                <h2>Bem-vindo de volta</h2>
                <p>Acesse sua conta UNISIN</p>

                {/* FORMULÁRIO */}
                <form className={Style.formLogin} onSubmit={(e) => {
                    e.preventDefault();
                    logar();
                }}>
                    <label>E-mail</label>
                    <input type="email" placeholder="voce@exemplo.com"
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                    <label>Senha</label>
                    <input type="password" placeholder="••••••••"
                        onChange={(e) => { setSenha(e.target.value) }}
                    />

                    <button className={Style.btnEntrar}
                        type="submit"
                    >
                        Entrar
                    </button>
                    <p className={Style.cadastro}>
                        Não tem conta?{" "}
                        <span onClick={() => {
                            fechar();
                            setMostrarCadastro(true);
                        }}>
                            Cadastre-se
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}