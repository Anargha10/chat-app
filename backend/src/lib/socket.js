import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    },
});


    export function getReceiverSocketId(userId){
        return userSocketMap[userId]
    }

    //used to store online users
    const userSocketMap ={}; // {userid(key): socketid(value)}


io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    
    const userId= socket.handshake.query.userId;
if (!userId) {
    console.error("User ID not provided during socket connection");
    socket.disconnect(true); // Forcefully disconnect invalid socket
    return;
}

    if(userId) {
        console.log(`Mapping userId ${userId} to socketId ${socket.id}`);
        userSocketMap[userId]= socket.id
    
    //i.o emit used to send events to all the connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        console.log("Online users:", Object.keys(userSocketMap));
    }else {
        console.error("User ID not provided during socket connection");
    }    
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        const userId = Object.keys(userSocketMap).find(
            (key) => userSocketMap[key] === socket.id
        );
        if (userId) {
            console.log(`User ID ${userId} found for socket ID ${socket.id}. Removing from userSocketMap.`);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
            console.log("Online users after disconnect:", Object.keys(userSocketMap));
        } else {
            console.error(`No user ID found for socket ID ${socket.id}.`);
        }
    });
    
    

    // Add error handling for socket events
    socket.on("error", (error) => {
        console.error("Socket error:", error);
       
    });
});

export { io, app, server };