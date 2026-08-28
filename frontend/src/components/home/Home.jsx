import React from "react";

import Style from "./home.module.css";

// Import Componentes
import Carrossel from "./carrossel/Carrossel";
import Header from "../layout/comps-home/Header";
import Footer from "../layout/comps-home/Footer";

export default function TelaHome() {
    return (
        <div>
            <Header />
            <Carrossel />
            {/* "Apresentação" do Unisin */}
            <div className={Style.containerApresentacao}>
                <div className={Style.divTituloApresentacao}>
                    <h1>Uma nova forma de aprender</h1>
                    <p>Educação, tecnologia e pessoas caminhando juntas</p>
                </div>
                <div className={Style.divCardsApresentacao}>
                    <div className={Style.cardApresentacao}>
                        <img src={require("../../imgs/default-home/img1.jpg")} alt="Educação" />
                        <h2>Educação</h2>
                    </div>
                    <div className={Style.cardApresentacao}>
                        <img src={require("../../imgs/default-home/img2.jpg")} alt="Tecnologia" />
                        <h2>Tecnologia</h2>
                    </div>
                    <div className={Style.cardApresentacao}>
                        <img src={require("../../imgs/default-home/img3.jpg")} alt="Alunos" />
                        <h2>Alunos</h2>
                    </div>
                    <div className={Style.cardApresentacao}>
                        <img src={require("../../imgs/default-home/img1.jpg")} alt="Professores" />
                        <h2>Professores</h2>
                    </div>
                </div>
            </div>
            {/* Apresentação de algumas matérias */}
            <div id="materias"></div>
            <Footer />
        </div>
    );
}