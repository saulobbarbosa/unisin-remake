// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Telas
import MainLayout from "./components/layout/main-layout/MainLayout";
import Home from "./components/home/Home";

// Import Telas de Aluno
import AlunoHome from "./components/aluno/home/HomeAluno";
import AlunoTrilha from "./components/aluno/trilha/Trilha";
import AlunoAtividade from "./components/aluno/atividade/Atividade";

import AlunoAmigos from "./components/aluno/amigos/Amigos";

import LojaAluno from "./components/aluno/loja/Loja";
import InventarioAluno from "./components/aluno/inventario/Inventario";

import PerfilAluno from "./components/aluno/perfil/Perfil";
// Import Telas Professores
import ProfessorAdmin from "./components/admin/professor/Professor";
// Import Telas Escolas
import EscolaAdmin from "./components/admin/escola/Escola";

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
                    <Route path="/aluno/lobby/:adversarioId" element={<h1>PVP</h1>} />

                    <Route path="/aluno/loja" element={<LojaAluno />} />
                    <Route path="/aluno/inventario" element={<InventarioAluno />} />
                    <Route path="/aluno/conquistas" element={<h1>Olha a Conquistas</h1>} />
                    <Route path="/aluno/ranking" element={<h1>Olha o Ranking</h1>} />
                    <Route path="/aluno/perfil/:alunoId" element={<PerfilAluno />} />
                    {/* Rotas Professores */}
                    <Route path="/home-prof" element={<ProfessorAdmin />} />
                    {/* Rotas Escolas */}
                    <Route path="/home-escola" element={<EscolaAdmin />} />
                </Route>
            </Routes>
        </Router>
    );
}
