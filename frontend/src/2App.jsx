import { useEffect } from "react";
import socket from "./services/socket";

function App() {
    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("Conectado ao servidor:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Desconectado do servidor");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Teste Socket.IO</h1>
        </div>
    );
}

export default App;