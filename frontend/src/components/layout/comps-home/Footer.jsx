import React from "react";

import Style from "./footer.module.css";

export default function CompFooterHome() {
    return (
        <div className={Style.containerFooter}>
            <div className={Style.divCima}>
                <div className={Style.divUnisin}>
                    <div className={Style.divLogotipo}>
                        <div className={Style.iconCap}>
                            <i className="fa-solid fa-graduation-cap"
                                style={{ fontSize: "1.25rem", color: "#fff" }}
                            ></i>
                        </div>
                        <h1>UNISIN</h1>
                    </div>
                    <p>
                        Plataforma educacional que conecta alunos, professores e escolas.
                    </p>
                </div>
                <div className={Style.divsPadroes}>
                    <h1>Desenvolvedores</h1>
                    <p>Saulo Batista Barbosa</p>
                    <p>Guilherme Leite Freitas</p>
                    <p>Leonardo Gomes da Silva</p>
                    <p>Uilton Gomes de Lima</p>
                </div>
                <div className={Style.divsPadroes}>
                    <h1>E-mails</h1>
                    <p>saulo.barbosa@aluno.cps.sp.gov.br</p>
                    <p>guilherme.freitas4@aluno.cps.sp.gov.br</p>
                    <p>leonardo.silva36@aluno.cps.sp.gov.br</p>
                    <p>uilton.lima@aluno.cps.sp.gov.br</p>
                </div>
                <div className={Style.divsPadroes}>
                    <h1>Tecnologias</h1>
                    <p>React.js</p>
                    <p>Node.js</p>
                    <p>MySQL</p>
                    <p>Docker</p>
                </div>
            </div>
            <p>© 2026 UNISIN — Todos os direitos reservados.</p>
        </div>
    );
}