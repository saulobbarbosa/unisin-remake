import React, { useState, useEffect } from "react";

// Import CSS e Imagem
import Style from "./carrossel.module.css";

import img1 from "../../../imgs/carrossel/img1.webp";
import img2 from "../../../imgs/carrossel/img2.webp";
import img3 from "../../../imgs/carrossel/img3.webp";

const images = [img1, img2, img3];

export default function CompCarrosselHome() {
    const [current, setCurrent] = useState(0);

    // Troca automática das imagens
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => prev === images.length - 1 ? 0 : prev + 1);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={Style.carrosselContainer}>
            {/* Imagens do carrossel */}
            <div className={Style.imageContainer}>
                {images.map((image, index) => (
                    <img key={index} src={image} alt="imagem de arara"
                        className={`${Style.image} ${index === current ? Style.imgActive : ""}`}
                        draggable="false"
                    />
                ))}
            </div>
            {/* Conteúdo fixo do meio */}
            <div className={Style.divContent}>
                <div className={Style.contentLabel}>
                    <p>PLATAFORMA EDUCACIONAL</p>
                </div>
                <div className={Style.contentText}>
                    <h1>Educação que <br /><span>conecta</span></h1>
                    <p>
                        A UNISIN aproxima alunos, professores e escolas com uma
                        experiência moderna, simples e feita para transformar o aprendizado.
                    </p>
                </div>
            </div>
            {/* Setas */}
            <div className={Style.divArrows}>
                <button className={Style.arrow} onClick={() => {
                    setCurrent((prev) => prev === 0 ? images.length - 1 : prev - 1)
                }}>
                    <i className="fa-solid fa-chevron-left" style={{ fontSize: "1rem", color: "#fff" }}></i>
                </button>
                <button className={Style.arrow} onClick={() => {
                    setCurrent((prev) => prev === images.length - 1 ? 0 : prev + 1)
                }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: "1rem", color: "#fff" }}></i>
                </button>
            </div>
            {/* Dots */}
            <div className={Style.divDot}>
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`${Style.dot} ${index === current ? Style.dotActive : ""}`}
                        onClick={() => { setCurrent(index) }}
                    />
                ))}
            </div>
        </div>
    );
}