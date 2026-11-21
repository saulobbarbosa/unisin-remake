// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import do Layout Principal do Sistema
import MainLayout from "./components/layout/main-layout/MainLayout";

// Import Telas
import Home from "./components/home/Home";

// Import Telas de Aluno
import AlunoHome from "./components/aluno/home/HomeAluno";
import AlunoTrilha from "./components/aluno/trilha/Trilha";
import AlunoAtividade from "./components/aluno/atividade/Atividade";

import AlunoAmigos from "./components/aluno/amigos/Amigos";
import AlunoLobby from "./components/aluno/lobby/Lobby";
import AlunoPvp from "./components/aluno/pvp/Pvp";

import AlunoLoja from "./components/aluno/loja/Loja";
import AlunoInventario from "./components/aluno/inventario/Inventario";

import AlunoRanking from "./components/aluno/ranking/Ranking";
import AlunoPerfil from "./components/aluno/perfil/Perfil";

// Import Telas Professores
import ProfessorAdmin from "./components/admin/professor/Professor";
// Import Telas Escolas
import EscolaAdmin from "./components/admin/escola/Escola";
// Import Tela Conquistas
import AlunoConquistas from "./components/aluno/conquistas/Conquistas";

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Rotas SEM layout */}
                <Route path="/" element={<Home />} />

                {/* Rotas com Layout fixo */}
                <Route element={<MainLayout />}>
                    {/* Rotas Alunos */}
                    <Route path="/aluno/home" element={<AlunoHome />} />
                    <Route path="/aluno/:materia" element={<AlunoTrilha />} />
                    <Route path="/aluno/:materia/atividade" element={<AlunoAtividade />} />

                    <Route path="/aluno/amigos" element={<AlunoAmigos />} />
                    <Route path="/aluno/lobby" element={<AlunoLobby />} />
                    <Route path="/aluno/pvp" element={<AlunoPvp />} />

                    <Route path="/aluno/loja" element={<AlunoLoja />} />
                    <Route path="/aluno/inventario" element={<AlunoInventario />} />

                    <Route path="/aluno/conquistas" element={<AlunoConquistas />} />
                    <Route path="/aluno/ranking" element={<AlunoRanking />} />

                    <Route path="/aluno/perfil/:alunoId" element={<AlunoPerfil />} />

                    {/* Rotas Professores */}
                    <Route path="/home-prof" element={<ProfessorAdmin />} />
                    {/* Rotas Escolas */}
                    <Route path="/home-escola" element={<EscolaAdmin />} />
                </Route>
            </Routes>
        </Router>
    );
}
