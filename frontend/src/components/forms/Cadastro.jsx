import React, { useState } from "react";
import Style from "../forms/Cadastro.module.css";

export default function CompCadastro({ fechar, entrar }) {

    const [tipoUsuario, setTipoUsuario] = useState("aluno");

    return (
        <div className={Style.overlay}>

            <div className={Style.modalCadastro}>

                {/* Botão fechar */}

                <button
                    className={Style.btnFechar}
                    onClick={fechar}
                >
                    ×
                </button>

                {/* Ícone */}

                <div className={Style.iconeUsuario}>
                    <i className="fa-solid fa-user"></i>
                </div>

                <h2>Crie sua conta</h2>

                <p className={Style.subtitulo}>
                    Junte-se à plataforma UNISIN
                </p>

                {/* Tipo de usuário */}

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


                {/* ===========================
                    ALUNO / PROFESSOR
                   ========================= */}

                {(tipoUsuario === "aluno" ||
                    tipoUsuario === "professor") && (

                    <div className={Style.formCadastro}>

                        <label>Nome completo</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-regular fa-user"></i>

                            <input
                                type="text"
                                placeholder="Seu nome"
                            />
                        </div>

                        <label>Data de nascimento</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-regular fa-calendar"></i>

                            <input
                                type="date"
                            />
                        </div>

                        <label>E-mail</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-regular fa-envelope"></i>

                            <input
                                type="email"
                                placeholder="voce@exemplo.com"
                            />
                        </div>


                        <label>Senha</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-solid fa-lock"></i>

                            <input
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>


                        <label>Confirmar senha</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-solid fa-lock"></i>

                            <input
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>


                        <label>Telefone</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-solid fa-phone"></i>

                            <input
                                type="tel"
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <button className={Style.btnCadastrar}>
                            Cadastrar
                        </button>

                    </div>
                )}

                {/* =============================
                    ESCOLA
                   ========================= */}

                {tipoUsuario === "escola" && (

                    <div className={Style.formCadastro}>

                        <label>Nome da escola</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-solid fa-school"></i>

                            <input
                                type="text"
                                placeholder="Nome da instituição"
                            />
                        </div>

                        <div className={Style.duasColunas}>

                            <div>
                                <label>CEP</label>

                                <div className={Style.inputIcon}>
                                    <i className="fa-solid fa-hashtag"></i>

                                    <input
                                        type="text"
                                        placeholder="00000-000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Número</label>

                                <div className={Style.inputIcon}>
                                    <i className="fa-solid fa-hashtag"></i>

                                    <input
                                        type="text"
                                        placeholder="123"
                                    />
                                </div>
                            </div>

                        </div>

                        <label>Endereço</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-solid fa-location-dot"></i>

                            <input
                                type="text"
                                placeholder="Rua, avenida..."
                            />
                        </div>

                        <div className={Style.duasColunas}>

                            <div>
                                <label>Cidade</label>

                                <div className={Style.inputIcon}>
                                    <i className="fa-solid fa-city"></i>

                                    <input
                                        type="text"
                                        placeholder="Cidade"
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Estado</label>

                                <div className={Style.inputIcon}>
                                    <i className="fa-solid fa-location-dot"></i>

                                    <input
                                        type="text"
                                        placeholder="UF"
                                        maxLength="2"
                                    />
                                </div>
                            </div>

                        </div>

                        <label>E-mail</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-regular fa-envelope"></i>

                            <input
                                type="email"
                                placeholder="escola@exemplo.com"
                            />
                        </div>

                        <label>Senha</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-solid fa-lock"></i>

                            <input
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>

                        <label>Confirmar senha</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-solid fa-lock"></i>

                            <input
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>

                        <label>Telefone</label>

                        <div className={Style.inputIcon}>
                            <i className="fa-solid fa-phone"></i>

                            <input
                                type="tel"
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <button className={Style.btnCadastrar}>
                            Cadastrar
                        </button>

                    </div>
                )}

                {/* Rodapé */}

                <p className={Style.loginLink}>
                    Já tem conta?

                    <span onClick={entrar}>
                        Entrar
                    </span>
                </p>

            </div>

        </div>
    );
}