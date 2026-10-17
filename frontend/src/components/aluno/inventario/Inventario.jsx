import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./inventario.module.css";

export default function TelaInventario() {
    // Menu Automático
    const [menuOpcoes, setMenuOpcoes] = useState("bordas");
    const opcoesMenu = [
        { id: "bordas", titulo: "Bordas" },
        { id: "backgrounds", titulo: "Backgrounds" },
        { id: "avatares", titulo: "Avatares" },
        { id: "titulos", titulo: "Títulos" },
    ];
    //
    const [dadosUser, setDadosUser] = useState([]);
    const [itens, setItens] = useState({});

    const carregarDados = async () => {
        try {
            const response = await axios.get("/dadosJson/usuarios.json");
            const idUser = localStorage.getItem("id");
            const usuario = response.data.find(u => String(u.id) === String(idUser));
            if (!usuario) {
                console.error("Usuário não encontrado para o ID:", idUser);
                return;
            }
            setDadosUser(usuario);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    }

    const carregarItens = async () => {
        try {
            const response = await axios.get("/dadosJson/loja.json");
            setItens(response.data);
        } catch (error) {
            console.error("Erro ao carregar os Dados da loja", error);
        }
    }

    const categoriaDados = {
        bordas: "bordas",
        backgrounds: "backgrounds",
        avatares: "avatares",
        titulos: "titulos",
    };
    const itensExibidos = itens[categoriaDados[menuOpcoes]] || [];

    useEffect(() => {
        carregarDados();
        carregarItens();
    }, []);

    // Função para verificar se o item está equipado
    const isEquipado = false;

    return (
        <div className={Style.containerInventario}>
            <div className={Style.tituloInventario}>
                <i className="fa-solid fa-suitcase-rolling"></i>
                <h1>Inventário</h1>
            </div>
            <div className={Style.divInventarioPreview}>
                <div className={Style.divPreview}>
                    <div className={Style.preview}
                        style={{ background: dadosUser?.fundo || "#0f172a" }}
                    >
                        <img src={dadosUser?.avatar || "/imagens/avatar-padrao.png"} alt="Avatar"
                            style={{ border: `0.3rem solid ${dadosUser?.borda || "#64748b"}` }}
                        />
                        <h1>{dadosUser.titulo}</h1>
                    </div>
                    <div className={Style.divEquipadosTexto}>
                        <div className={Style.textoEquipado}>
                            <p>Avatar</p>
                            <p>Borda</p>
                            <p>Fundo</p>
                            <p>Título</p>
                        </div>
                        <div className={Style.textoEquipado}
                            style={{ textAlign: "center", maxWidth: "60%" }}
                        >
                            <p>{dadosUser?.nomeAvatar || "---"}</p>
                            <p>{dadosUser?.borda || "---"}</p>
                            <p>{dadosUser?.fundo || "---"}</p>
                            <p>{dadosUser?.titulo || "---"}</p>
                        </div>
                    </div>
                </div>
                <div className={Style.divInventario}>
                    {/* Menu de Navegação do Inventário */}
                    <div className={Style.divMenuLoja}>
                        {opcoesMenu.map((opcao) => (
                            <div key={opcao.id}
                                className={`
                                    ${Style.opcaoMenu} 
                                    ${menuOpcoes === opcao.id ? Style.opcaoMenuAtiva : ""}
                                `}
                                onClick={() => { setMenuOpcoes(opcao.id) }}
                            >
                                <h1>{opcao.titulo}</h1>
                            </div>
                        ))}
                    </div>
                    {/* Exibição dos Itens/Produtos */}
                    <div className={Style.divExibirItens}>
                        {itensExibidos.map((item) => (
                            <div className={Style.cardItem} key={item.id}>
                                <div className={Style.previewItem}
                                    style={
                                        menuOpcoes !== "backgrounds" ? {
                                            background:
                                                "linear-gradient(to bottom right, #0f172a, #1e293b)"
                                        } : { background: item.color }
                                    }
                                >
                                    {menuOpcoes === "bordas" && (
                                        <div className={Style.previewAvatar}>
                                            <img src={dadosUser.avatar} alt="Avatar"
                                                style={{ border: `0.3rem solid ${item.color}` }}
                                            />
                                        </div>
                                    )}
                                    {menuOpcoes === "avatares" && (
                                        <div className={Style.previewAvatar}>
                                            <img src={item.img} alt="Avatar"
                                                style={{ border: `0.3rem solid ${dadosUser.borda}` }}
                                            />
                                        </div>
                                    )}
                                    {menuOpcoes === "titulos" && (
                                        <div className={Style.previewTitulo}>
                                            <h1>{item.titulo}</h1>
                                        </div>
                                    )}
                                </div>
                                <div className={Style.divNomeBotao}>
                                    {/* Nome do Item */}
                                    <h1>{item.nome}</h1>
                                    {/* Botão de ação do Item */}
                                    <div className={`
                                        ${Style.btnAcao}
                                        ${isEquipado ?
                                            Style.btnEquipado : Style.btnEquipar
                                        }`}
                                    >
                                        {isEquipado ? (
                                            <i className="fa-solid fa-check"></i>
                                        ) : null}
                                        <p>
                                            {isEquipado ? (
                                                "Equipado"
                                            ) : "Equipar"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}