import { io } from "socket.io-client";

const socket = io("http://localhost:5001", {
    transports: ["websocket"], // Optional: use ["websocket", "polling"] for fallback
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
});

socket.on("connect", () => {
    console.log("✅ Socket.IO connected! ID:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("❌ Socket.IO connection error:", err.message);
});

export default socket;
