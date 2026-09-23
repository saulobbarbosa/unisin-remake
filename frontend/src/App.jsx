// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Telas
import MainLayout from "./components/layout/main-layout/MainLayout";
import Home from "./components/home/Home";

// Import Telas de Aluno
import HomeAluno from "./components/aluno/home/HomeAluno";
import Amigos from "./components/aluno/amigos/Amigos";

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Rotas SEM layout */}
                <Route path="/" element={<Home />} />

                {/* Rotas com Layout fixo */}
                <Route element={<MainLayout />}>
                    <Route path="/home-aluno" element={<HomeAluno />} />
                    <Route path="/amigos" element={<Amigos />} />
                </Route>
            </Routes>
        </Router>
    );
}
