import React, { useState, useEffect } from "react";

import axios from "axios";

import Style from "./escola.module.css";



export default function TelaEscola() {
    const [abrirModal, setAbrirModal] = useState(false);
    const [professores, setProfessores] = useState([]);
    const [professorEditando, setProfessorEditando] = useState(null);
    const [notificacao, setNotificacao] = useState(null);
    const [professor, setProfessor] = useState({

        nome: "",
        email: "",
        senha: "",
        telefone: ""

    });
    const carregarProfessores = async () => {
        try {
            const response = await axios.get("/dadosJson/usuarios.json");

            const professoresEncontrados = response.data.filter(
                usuario => usuario.tipo === "professor"
            );

            setProfessores(professoresEncontrados);
        
        } catch (error) {
            console.error("Erro ao carregar professores", error);
        }
    };

    const mostrarNotificacao = (mensagem, tipo = "sucesso") => {
        setNotificacao({
            mensagem, tipo //FOR YOUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU
        });
    };

    useEffect(() => {
        carregarProfessores();
    }, []);

    useEffect(() => {
        if (!notificacao) return;

        const timer = setTimeout(() => {
            setNotificacao(null);
        }, 3500);

        return () => clearTimeout(timer);
    }, [notificacao]);

    const capturarValoresInputs = (e) => {
        const { name, value } = e.target;

        setProfessor(prev => ({
            ...prev,
            [name]: name === "telefone" ? mascaraTelefone(value) : value
        }));

    }
    const editarProfessor = (prof) => {
        setProfessorEditando(prof.id);

        setProfessor({
            nome: prof.nome,
            email: prof.email,
            senha: "",
            telefone: prof.telefone
        });

        setAbrirModal(true);
    };

    const mascaraTelefone = (valor) => {
        return valor
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d)(\d{4})$/, "$1-$2");
    }

    const cadastrarProfessor = (e) => {
        e.preventDefault();

        if (professorEditando !== null) {
            // Editar professor existente
            setProfessores(prev =>
                prev.map(prof =>
                    prof.id === professorEditando ? {
                        ...prof,
                        nome: professor.nome,
                        email: professor.email,
                        telefone: professor.telefone
                    }
                        : prof
                ) // pesquisei
            );
            mostrarNotificacao("Dados do professor atualizados com sucesso!", "aviso");
        } else {
            // Cadastrar novo professor
            const novoProfessor = {
                id: Date.now(),
                nome: professor.nome,
                materia: "Matéria não definida",
                email: professor.email,
                telefone: professor.telefone
            };
            mostrarNotificacao("Professor cadastrado com sucesso!",);

            setProfessores(prev => [...prev, novoProfessor]);
        }

        // Limpar formulário
        setProfessor({
            nome: "",
            email: "",
            senha: "",
            telefone: ""
        });

        setProfessorEditando(null);
        setAbrirModal(false);
    };

    const removerProfessor = (id) => {
        setProfessores(prev => prev.filter(prof => prof.id !== id));

        mostrarNotificacao("Professor removido com sucesso!", "erro");
    };

    return (
        <div className={Style.containerEscola}>

            {notificacao && (
                <div className={`${Style.notificacao} ${Style[notificacao.tipo]}`}>
                    <div className={Style.iconNotificacao}>
                        <i className={`fa-solid ${notificacao.tipo === "sucesso" ? "fa-check" : notificacao.tipo === "aviso" ? "fa-exclamation" : "fa-xmark"}`}></i>
                    </div>

                    <div className={Style.textoNotificacao}>
                        <h3>
                            {notificacao.tipo === "sucesso"
                                ? "Sucesso!"
                                : notificacao.tipo === "aviso"
                                    ? "Atenção!"
                                    : "Excluído!"}
                        </h3>

                        <p>{notificacao.mensagem}</p>
                    </div>

                    <button
                        className={Style.fecharNotificacao}
                        onClick={() => setNotificacao(null)}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            )}

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
                    onClick={() => {
                        setProfessorEditando(null);
                        setProfessor({
                            nome: "",
                            email: "",
                            senha: "",
                            telefone: ""
                        });
                        setAbrirModal(true);
                    }}
                >

                    <p>+ Cadastrar Professor</p>
                </button>
            </div>
            <div className={Style.divCardsProfessores}>
                {professores.map((prof) => (
                    <div className={Style.cardProfessor} key={prof.id}>

                        <div className={Style.infoPrincipalProfessor}>
                            <div className={Style.avatarProfessor}>
                                <i className="fa-solid fa-user"></i>
                            </div>

                            <div className={Style.nomeProfessor}>
                                <h2>{prof.nome}</h2>
                                <p>{prof.materia}</p>
                            </div>
                        </div>

                        <div className={Style.infoProfessor}>
                            <p>
                                <i className="fa-regular fa-envelope"></i>
                                <span>{prof.email}</span>
                            </p>

                            <p>
                                <i className="fa-solid fa-phone"></i>
                                <span>{prof.telefone}</span>
                            </p>

                            <p>
                                <i className="fa-solid fa-book-open"></i>
                                <span>{prof.materia}</span>
                            </p>
                        </div>

                        <div className={Style.acoesProfessor}>
                            <button className={Style.btnEditar} onClick={() => editarProfessor(prof)}>

                                <i className="fa-solid fa-pen"></i>

                                Editar
                            </button>

                            <button
                                className={Style.btnRemover}
                                onClick={() => removerProfessor(prof.id)}
                            >
                                <i className="fa-regular fa-trash-can"></i>
                                Remover
                            </button>
                        </div>
                    </div>
                ))}
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
                        <form onSubmit={cadastrarProfessor}>
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
                                <p>
                                    {professorEditando !== null ? "Salvar Alterações" : "Cadastrar"}
                                </p>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}