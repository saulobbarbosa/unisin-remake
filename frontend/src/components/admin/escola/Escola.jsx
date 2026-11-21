import React, { useState } from "react";
// import axios from "axios";

import Style from "./escola.module.css";

export default function TelaEscola() {
    const [abrirModal, setAbrirModal] = useState(false);
    const [professor, setProfessor] = useState({
        nome: "",
        email: "",
        senha: "",
        telefone: ""
    });

    const capturarValoresInputs = (e) => {
        const { name, value } = e.target;

        setProfessor(prev => ({
            ...prev,
            [name]: name === "telefone" ? mascaraTelefone(value) : value
        }));
    }

    const mascaraTelefone = (valor) => {
        return valor
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d)(\d{4})$/, "$1-$2");
    }

    const cadastrarProfessor = (e) => {
        e.preventDefault();
        setAbrirModal(false);
        alert("Cadastro");
    }

    return (
        <div className={Style.containerEscola}>
            <div className={Style.divTitulo}>
                <div>
                    <div className={Style.divIconProfessor}>
                        <i className="fa-solid fa-user-group"></i>
                        <h1>Professores</h1>
                    </div>
                    <p className={Style.paragrafoTitulo}>
                        Gerencie o corpo docente da sua instituição.
                    </p>
                </div>
                <button className={Style.btnAbrirModal}
                    onClick={() => { setAbrirModal(true) }}
                >
                    <p>+ Cadastrar Professor</p>
                </button>
            </div>
            <div className={Style.divCardsProfessores}>
                <div>
                    <div></div>
                    <p></p>
                    <p></p>
                    <p></p>
                    <div>
                        <button><p>Editar</p></button>
                        <button><p>Remover</p></button>
                    </div>
                </div>
            </div>
            {/* Modal para Cadastro de Professores */}
            {abrirModal && (
                <div className={Style.containerModal}>
                    <div className={Style.overlayModal}
                        onClick={() => setAbrirModal(false)}
                    ></div>
                    <div className={Style.form}>
                        <div className={Style.tituloForm}>
                            <h1>Cadastrar Professor(a)</h1>
                            <i className="fa-solid fa-x"
                                onClick={() => { setAbrirModal(false) }}
                            ></i>
                        </div>
                        <form onSubmit={() => { cadastrarProfessor() }}>
                            <div className={Style.divInput}>
                                <label>Nome</label>
                                <input type="text" name="nome" required
                                    placeholder="Digite o nome completo"
                                    value={professor.nome}
                                    onChange={capturarValoresInputs}
                                />
                            </div>
                            <div className={Style.divInput}>
                                <label>E-mail</label>
                                <input type="email" name="email" required
                                    placeholder="exemplo@email.com"
                                    value={professor.email}
                                    onChange={capturarValoresInputs}
                                />
                            </div>
                            <div className={Style.divInput}>
                                <label>Senha</label>
                                <input type="password" name="senha" required
                                    placeholder="Digite uma senha"
                                    value={professor.senha}
                                    onChange={capturarValoresInputs}
                                />
                            </div>
                            <div className={Style.divInput}>
                                <label>Telefone</label>
                                <input type="tel" name="telefone" required
                                    placeholder="(00) 00000-0000"
                                    value={professor.telefone}
                                    onChange={capturarValoresInputs}
                                />
                            </div>
                            <button type="submit"
                                className={Style.btnCadastrar}
                            >
                                <p>Cadastrar</p>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}