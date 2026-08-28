import React, { useState } from "react";
import Style from "./Login.module.css";

export default function Login({ fechar }) {

    const [tipoUsuario, setTipoUsuario] = useState("aluno");

    return (
        <div className={Style.overlay}>

            <div className={Style.modalLogin}>

                <button
                    className={Style.btnFechar}
                    onClick={fechar}
                >
                    ×
                </button>

                <div className={Style.iconeUsuario}>
                    <i className="fa-solid fa-user"></i>
                </div>

                <h2>Bem-vindo de volta</h2>
                <p>Acesse sua conta UNISIN</p>

                {/* TIPOS DE USUÁRIO */}

                <div className={Style.tipoUsuario}>

                    <button
                        className={
                            tipoUsuario === "aluno" ? Style.ativo : ""
                        }
                        onClick={() => setTipoUsuario("aluno")}
                    >
                        Aluno
                    </button>

                    <button
                        className={
                            tipoUsuario === "professor" ? Style.ativo : ""
                        }
                        onClick={() => setTipoUsuario("professor")}
                    >
                        Professor
                    </button>

                    <button
                        className={
                            tipoUsuario === "escola" ? Style.ativo : ""
                        }
                        onClick={() => setTipoUsuario("escola")}
                    >
                        Escola
                    </button>

                </div>


                {/* FORMULÁRIO */}

                <div className={Style.formLogin}>

                    <label>E-mail</label>
                    <input type="email" placeholder="voce@exemplo.com" />
                    <label>Senha</label>

                    <input type="password" placeholder="••••••••" />

                    <button className={Style.btnEntrar}>
                        Entrar como {tipoUsuario}
                    </button>

                    <p className={Style.cadastro}>
                        Não tem conta? <span>Cadastre-se</span>
                    </p>

                </div>

            </div>

        </div>
    );
}