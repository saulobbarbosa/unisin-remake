import React from "react";

// import Style from "./home.module.css";

// Import Componentes
import Carrossel from "./carrossel/Carrossel";
import Header from "../layout/header-home/HeaderHome";

export default function TelaHome(){
    return(
        <div>
            <Header />
            <Carrossel />
        </div>
    );
}