// App.js
import React, { useEffect, useState } from "react";

function App() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const username = prompt("Enter your username") || "Guest";
        const chat = prompt("Enter Chat ID") || "123"
        const socket = new WebSocket(`ws://localhost:3000?user=${encodeURIComponent(username)}&chat=${encodeURIComponent(chat)}`);
        setWs(socket);

        socket.onmessage = (event) => {
            setMessages(prev => [...prev, event.data]);
        };

        return () => socket.close();
    }, []);

    const sendMessage = () => {
        if (ws && input.trim()) {
            ws.send(input);
            setInput("");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>WebSocket Chat</h2>
            <div style={{
                border: "1px solid #ccc",
                height: "300px",
                overflowY: "auto",
                padding: "10px",
                marginBottom: "10px"
            }}>
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                style={{ marginRight: "10px" }}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default App;
