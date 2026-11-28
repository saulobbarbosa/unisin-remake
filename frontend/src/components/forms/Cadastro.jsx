import React, { useState } from "react";
import axios from "axios";

import Style from "../forms/cadastro.module.css";

export default function CompCadastro({ fechar, entrar, tipoUsuario }) {
    const [dadosCadastroAluno, setDadosCadastroAluno] = useState({
        nome: "",
        dt_nasc: "",
        email: "",
        senha: ""
    });

    const capturarValoresAluno = (e) => {
        const { name, value } = e.target;
        setDadosCadastroAluno(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const cadastrarAluno = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("/api/alunos" , dadosCadastroAluno);
            console.log("Aluno Cadastrado:", response.data);
            entrar();
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error);
        }
    }

    return (
        <div className={Style.overlay}>
            <div className={Style.modalCadastro}>
                {/* Botão fechar */}
                <button className={Style.btnFechar}
                    onClick={() => { fechar() }}
                >
                    <i className="fa-solid fa-x" style={{ fontSize: "1rem", color: "#000" }}></i>
                </button>
                {/* Ícone */}
                <div className={Style.iconeUsuario}>
                    <i className="fa-solid fa-user"></i>
                </div>
                <h2>Crie sua conta</h2>
                <p className={Style.subtitulo}>
                    Junte-se à plataforma UNISIN
                </p>
                {/* ==============ALUNO============== */}
                {(tipoUsuario === "") && (
                    <form className={Style.formCadastro}
                        onSubmit={cadastrarAluno}
                    >
                        <label>Nome completo</label>
                        <div className={Style.inputIcon}>
                            <i className="fa-regular fa-user"></i>
                            <input type="text" placeholder="Seu nome" name="nome" required
                                value={dadosCadastroAluno.nome} onChange={capturarValoresAluno}
                            />
                        </div>
                        <label>Data de nascimento</label>
                        <div className={Style.inputIcon}>
                            <i className="fa-regular fa-calendar"></i>
                            <input type="date" name="dt_nasc" required
                                value={dadosCadastroAluno.dt_nasc} onChange={capturarValoresAluno}
                            />
                        </div>
                        <label>E-mail</label>
                        <div className={Style.inputIcon}>
                            <i className="fa-regular fa-envelope"></i>
                            <input type="email" placeholder="voce@exemplo.com" name="email" required
                                value={dadosCadastroAluno.email} onChange={capturarValoresAluno}
                            />
                        </div>
                        <label>Senha</label>
                        <div className={Style.inputIcon}>
                            <i className="fa-solid fa-lock"></i>
                            <input type="password" placeholder="••••••••" name="senha" required
                                value={dadosCadastroAluno.senha} onChange={capturarValoresAluno}
                            />
                        </div>
                        <button type="submit" className={Style.btnCadastrar}>
                            Cadastrar
                        </button>
                    </form>
                )}
                {/* ==============ESCOLA============== */}
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