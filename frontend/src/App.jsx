// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Telas
import Home from "./components/home/Home";
import Amigos from "./components/amigos/Amigos";

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Rotas SEM layout */}
                <Route path="/" element={<Home />} />
                <Route path="/amigos" element={<Amigos />} />

                {/* Rotas com Layout fixo */}
                {/* <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                </Route> */}
            </Routes>
        </Router>
    );
}
