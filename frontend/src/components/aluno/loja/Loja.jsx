import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./loja.module.css";

export default function TelaLoja() {
    // Menu Automático
    const [menuOpcoes, setMenuOpcoes] = useState("bordas");
    const opcoesMenu = [
        { id: "bordas", titulo: "Bordas" },
        { id: "backgrounds", titulo: "Backgrounds" },
        { id: "avatares", titulo: "Avatares" },
        { id: "titulos", titulo: "Títulos" },
    ];
    //
    const [dadosLoja, setDadosLoja] = useState({});
    const [dadosUser, setDadosUser] = useState([]);

    const carregarDados = async () => {
        try {
            const response = await axios.get("/dadosJson/loja.json");
            setDadosLoja(response.data);
        } catch (error) {
            console.error("Erro ao carregar os Dados da loja", error);
        }
    }

    const getMoedasUser = async () => {
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
            console.error("Erro ao carregar moedas do usuário", error);
        }
    }

    const categoriaDados = {
        bordas: "bordas",
        backgrounds: "backgrounds",
        avatares: "avatares",
        titulos: "titulos",
    };
    const itensExibidos = dadosLoja[categoriaDados[menuOpcoes]] || [];

    useEffect(() => {
        carregarDados();
        getMoedasUser();
    }, []);

    // Função para verificar se tem como comprar
    const verificarCompra = (moedasUser, valorItem) => {
        if (moedasUser == null) return "block";

        return Number(moedasUser) >= Number(valorItem)
            ? "comprar"
            : "block";
    };
    return (
        <div className={Style.containerLoja}>
            {/* Header Loja */}
            <div className={Style.headerLoja}>
                <div className={Style.parteDireitaHeader}>
                    <div className={Style.tituloLoja}>
                        <i className="fa-solid fa-bag-shopping"></i>
                        <h1>Loja</h1>
                    </div>
                    <p>
                        Personalize seu perfil com itens exclusivos.
                    </p>
                </div>
                <div className={Style.parteEsquerdaHeader}>
                    <img src={require('../../../imgs/moeda.png')} alt="Icon de Moeda" />
                    <p>{dadosUser.moedas}</p>
                </div>
            </div>
            {/* Menu de Navegação da Loja */}
            <div className={Style.divMenuLoja}>
                {opcoesMenu.map((opcao) => (
                    <div key={opcao.id}
                        className={`${Style.opcaoMenu} ${menuOpcoes === opcao.id ? Style.opcaoMenuAtiva : ""
                            }`}
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
                                    background: "linear-gradient(to bottom right, #0f172a, #1e293b)"
                                } : { background: item.color }
                            }
                        >
                            {menuOpcoes === "bordas" && (
                                <div className={Style.previewAvatar}>
                                    <img src={`/imgs/boy_black.webp`} alt="Avatar"
                                        style={{ border: `0.3rem solid ${item.color}` }}
                                    />
                                </div>
                            )}
                            {menuOpcoes === "avatares" && (
                                <div className={Style.previewAvatar}>
                                    <img src={item.img} alt={item.nome}
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
                        {/* Nome do Item */}
                        <h1>{item.nome}</h1>
                        <div className={Style.divValorAcao}>
                            {/* Valor do Item */}
                            <div className={Style.valorItem}>
                                <img src={require('../../../imgs/moeda.png')} alt="Icon de Moeda" />
                                <p>{item.preco}</p>
                            </div>
                            {/* Botão de ação do Item */}
                            <div className={`${Style.btnAcao}
                                ${verificarCompra(dadosUser.moedas, item.preco) === "block" ?
                                    Style.btnAcaoBlock : Style.btnAcaoComprar
                                }`}
                            >
                                {verificarCompra(dadosUser.moedas, item.preco) === "block" ? (
                                    <i className="fa-solid fa-lock"></i>
                                ) : null}
                                <p>
                                    Comprar
                                </p>
                            </div>
                            {/* <div className={`${Style.btnAcao} ${Style.btnAcaoAdquirido}`}>
                                <i className="fa-solid fa-check"></i>
                                <p>Adquirido</p>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}