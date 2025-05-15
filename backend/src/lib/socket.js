import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === "production"
            ? [process.env.FRONTEND_URL, "https://mernstack-chatapp.onrender.com"]
            : ["http://localhost:5173"],
    },
});

// Used to store onliine users
const userSocketMap = {};//{userId : socketId}// we wiil sture user id as key and socket id as value 


export function getReceiverSocketId(userId) {
    return userSocketMap[userId];//t retrieves a socket ID for a given user ID from a map called userSocketMap.
}




// Socket connection handler
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId
    if (userId) {
        userSocketMap[userId] = socket.id; // with the help of this we will gather all userId which handshake with socket menas those are online
    }
    // io.emits() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        // when user disconnect we will remove that user from userSocketMap
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
