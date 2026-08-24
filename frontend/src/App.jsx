import { BrowserRouter as Routers, Routes, Route } from "react-router-dom"

// Import Telas
import Home from "./components/home/Home";

export default function App() {
    return (
        <Routers>
            <Routes>
                {/* Rotas SEM layout */}
                <Route path="/" element={<Home />} />

                {/* Rotas com Layout fixo */}
                {/* <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                </Route> */}
                
            </Routes>
        </Routers>
    );
}