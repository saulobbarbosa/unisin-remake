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
            <section className={Style.containerPadrao}>
                <div>
                    <h1 className={Style.tituloPadrao}>Uma nova forma de aprender</h1>
                    <p className={Style.paragrafoPadrao}>
                        Educação, tecnologia e pessoas caminhando juntas
                    </p>
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
                        <img src={require("../../imgs/default-home/img4.jpg")} alt="Professores" />
                        <h2>Professores</h2>
                    </div>
                </div>
            </section>
            {/* Apresentação de algumas matérias */}
            <section id="materias" className={Style.containerPadrao}>
                <div>
                    <span className={Style.subTituloPadrao}>APRENDIZADO</span>
                    <h1 className={Style.tituloPadrao}>Algumas das Matérias Disponíveis</h1>
                    <p className={Style.paragrafoPadrao}>
                        Conteúdo completo, atualizado e alinhado à realidade das escolas.
                    </p>
                </div>
                <div>

                </div>
            </section>
            {/* Apresentação do projeto */}
            <section id="sobre" className={Style.containerPadrao}>
                <div className={Style.containerSobre}>
                    <span className={Style.subTituloPadrao}>SOBRE NÓS</span>
                    <h1 className={Style.tituloPadrao}>
                        Nossa missão é <span>transformar a educação</span>
                    </h1>
                    <p className={Style.paragrafoPadrao}>
                        A UNISIN nasceu com o propósito de facilitar o ensino e aproximar escolas,
                        professores e alunos por meio da tecnologia.
                    </p>
                    <p className={Style.paragrafoPadrao}>
                        Acreditamos que uma boa educação começa com boas ferramentas. Por isso,
                        criamos uma plataforma intuitiva e completa, onde cada parte da comunidade
                        escolar encontra tudo o que precisa em um só lugar — do conteúdo às notas,
                        do planejamento à comunicação.
                    </p>
                </div>
            </section>
            {/* Apresentação de benefícios */}
            <section id="beneficios" className={Style.containerPadrao}>
                <div>
                    <span className={Style.subTituloPadrao}>VANTAGENS</span>
                    <h1 className={Style.tituloPadrao}>Benefícios</h1>
                    <p className={Style.paragrafoPadrao}>
                        Tudo o que uma plataforma educacional moderna precisa ter.
                    </p>
                </div>
                <div className={Style.divBeneficios}>
                    <div className={Style.blocoBeneficio}>
                        <div className={Style.icons}>
                            <i className="fa-solid fa-table-columns"></i>
                        </div>
                        <div className={Style.textoBeneficios}>
                            <h1>Ensino organizado</h1>
                            <p>Conteúdos estruturados por matéria, turma e nível.</p>
                        </div>
                    </div>
                    <div className={Style.blocoBeneficio}>
                        <div className={Style.icons}>
                            <i className="fa-solid fa-wifi"></i>
                        </div>
                        <div className={Style.textoBeneficios}>
                            <h1>Acesso online</h1>
                            <p>Estude de qualquer lugar, em qualquer dispositivo.</p>
                        </div>
                    </div>
                    <div className={Style.blocoBeneficio}>
                        <div className={Style.icons}>
                            <i className="fa-solid fa-book-open"></i>
                        </div>
                        <div className={Style.textoBeneficios}>
                            <h1>Facilidade para professores</h1>
                            <p>Ferramentas para criar, publicar e avaliar atividades.</p>
                        </div>
                    </div>
                    <div className={Style.blocoBeneficio}>
                        <div className={Style.icons}>
                            <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <div className={Style.textoBeneficios}>
                            <h1>Acompanhamento dos alunos</h1>
                            <p>Relatórios de progresso em tempo real.</p>
                        </div>
                    </div>
                    <div className={Style.blocoBeneficio}>
                        <div className={Style.icons}>
                            <i className="fa-solid fa-user-group"></i>
                        </div>
                        <div className={Style.textoBeneficios}>
                            <h1>Ambiente intuitivo</h1>
                            <p>Interface moderna e fácil de usar para todas as idades.</p>
                        </div>
                    </div>
                    <div className={Style.blocoBeneficio}>
                        <div className={Style.icons}>
                            <i className="fa-solid fa-comments"></i>
                        </div>
                        <div className={Style.textoBeneficios}>
                            <h1>Comunicação direta</h1>
                            <p>Escola, professor e estudante conectados em um só lugar.</p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}