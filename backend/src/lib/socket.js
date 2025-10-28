// socket.js

// (1) Import dependencies
import http from "http";
import express from "express";
import { Server } from "socket.io";
import { detectEmotion } from "./aiService.js"; // ✅ (1.1) Import AI emotion detection helper

// (2) Create an Express app instance
const app = express();

// (3) Create an HTTP server using the Express app
const server = http.createServer(app);

// (4) Initialize a new Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // (4.1) Allow frontend to connect
        methods: ["GET", "POST"],
        credentials: true
    }
});

// (5) Create a map to store online users (userId -> socketId)
const userSocketMap = {};

// (6) Utility function to get socket ID for a receiver user
export function getReceiverSocketId(userId) {
    return userSocketMap[userId] || null; // ✅ (6.1) Prevent undefined errors
}

// (7) Listen for new client connections
io.on("connection", (socket) => {
    console.log("✅ (7.1) A user connected:", socket.id);

    // (8) Get userId from the frontend's connection query
    const userId = socket.handshake.query.userId;

    // (9) Store the connected user's socket ID
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // (10) Notify all clients about the current list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // (11) Listen for "message" events sent from the frontend
    socket.on("message", (data) => {
        // (11.1) Check if message is valid
        if (!data || !data.text || data.text.trim() === "") {
            console.log("⚠️ Empty message received, skipping AI detection.");
            return;
        }

        // (11.2) Log the received message
        console.log("📝 Processing message:", data.text);

        // (11.3) Detect emotion using AI helper
        const emotion = detectEmotion(data.text);
        console.log("🔍 Detected Emotion:", emotion);

        // (11.4) Generate AI-based chat suggestion
        let suggestion = "";
        if (emotion.includes("Angry")) {
            suggestion = "Let's cool down and resolve this peacefully. 💙";
        } else if (emotion.includes("Happy")) {
            suggestion = "This chat is full of joy! Keep spreading the positivity! 😊";
        }

        // (11.5) Send suggestion back to the same client
        console.log("💡 AI Suggestion:", suggestion);
        socket.emit("moodSuggestion", { emotion, suggestion });
    });

    // (12) Listen for "disconnect" event
    socket.on("disconnect", () => {
        console.log("❌ (12.1) User disconnected:", socket.id);

        // (12.2) Remove user from map
        Object.keys(userSocketMap).forEach(userId => {
            if (userSocketMap[userId] === socket.id) {
                delete userSocketMap[userId];
            }
        });

        // (12.3) Notify all clients about updated online users
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// (13) (Optional) Start the backend server manually if needed
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`🚀 Backend running on PORT ${PORT}`);
// });

// (14) Export app, server, and io for use in controller or index.js
export { app, server, io };
