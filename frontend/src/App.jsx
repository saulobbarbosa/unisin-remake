import { BrowserRouter as Routers, Routes, Route } from "react-router-dom"

// Import Telas

export default function App() {
    return (
        <Routers>
            <Routes>
                {/* Rotas SEM layout */}
                {/* <Route path="/login" element={<Login />} /> */}

                {/* Rotas com Layout fixo */}
                {/* <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                </Route> */}
                
            </Routes>
        </Routers>
    );
}