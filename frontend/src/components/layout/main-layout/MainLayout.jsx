import React, { useRef } from "react";
import { Outlet } from "react-router-dom";

import Style from "./mainLayout.module.css";

// Import dos Componentes
import TopBar from "../top-bar/Header";

export default function TelaLayout() {
    const mainRef = useRef(null);
    return (
        <div className={Style.container}>
            {/* Topo fixo */}
            <TopBar />
            {/* Conteúdo dinâmico */}
            <main className={`${Style.main}`}>
                <div ref={mainRef} className={Style.scrollArea}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}