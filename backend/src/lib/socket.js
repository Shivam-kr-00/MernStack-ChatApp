// socket.js

import http from "http";
import express from "express";
import { Server } from "socket.io";
import { detectEmotion } from "./aiService.js"; // ✅ Import AI emotion detection

const app = express();
const server = http.createServer(app);

// ✅ Fix CORS Settings: Allowing all origins temporarily for debugging
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // or your frontend port
        methods: ["GET", "POST"],
        credentials: true
    }
});

// ✅ Store online users (userId -> socketId)
const userSocketMap = {};

export function getReceiverSocketId(userId) {
    return userSocketMap[userId] || null; // ✅ Prevent undefined errors
}

// 🔥 Handle user connections
io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Broadcast list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // 📩 Handle incoming messages
    socket.on("message", (data) => {
        if (!data || !data.text || data.text.trim() === "") {
            console.log("⚠️ Empty message received, skipping AI detection.");
            return;
        }

        console.log("📝 Processing message:", data.text);
        const emotion = detectEmotion(data.text);
        console.log("🔍 Detected Emotion:", emotion);

        let suggestion = "";
        if (emotion.includes("Angry")) {
            suggestion = "Let's cool down and resolve this peacefully. 💙";
        } else if (emotion.includes("Happy")) {
            suggestion = "This chat is full of joy! Keep spreading the positivity! 😊";
        }

        console.log("💡 AI Suggestion:", suggestion); // ✅ Log the suggestion
        socket.emit("moodSuggestion", { emotion, suggestion });
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
        Object.keys(userSocketMap).forEach(userId => {
            if (userSocketMap[userId] === socket.id) {
                delete userSocketMap[userId]; // ✅ Remove from map
            }
        });

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// // ✅ Fix Backend Port: Start server only when ready
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`🚀 Backend running on PORT ${PORT}`);
// });


// 👇 These three exports allow use in controller and index.js
export { app, server, io };

