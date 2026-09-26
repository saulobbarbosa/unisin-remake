// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Telas
import MainLayout from "./components/layout/main-layout/MainLayout";
import Home from "./components/home/Home";

// Import Telas de Aluno
import HomeAluno from "./components/aluno/home/HomeAluno";
import Amigos from "./components/aluno/amigos/Amigos";
// Import Telas Professores
// Import Telas Escolas

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Rotas SEM layout */}
                <Route path="/" element={<Home />} />

                {/* Rotas com Layout fixo */}
                <Route element={<MainLayout />}>
                    {/* Rotas Alunos */}
                    <Route path="/home-aluno" element={<HomeAluno />} />
                    <Route path="/amigos" element={<Amigos />} />
                    <Route path="/loja" element={<h1>Olha a Loja</h1>} />

                    {/* Rotas Professores */}
                    <Route path="/home-prof" element={<h1>Olá Professor</h1>} />
                    {/* Rotas Escolas */}
                    <Route path="/home-escola" element={<h1>Olá Escola</h1>} />
                </Route>
            </Routes>
        </Router>
    );
}
