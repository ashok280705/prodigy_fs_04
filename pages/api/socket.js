// pages/api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("✅ Socket is already running");
    res.end();
    return;
  }

  console.log("🚀 New Socket.io server...");
  const io = new Server(res.socket.server, {
    path: "/api/socket",
  });
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("👤 New client connected:", socket.id);

    socket.on("joinRoom", ({ roomId }) => {
      socket.join(roomId);
      console.log(`🟢 ${socket.id} joined room: ${roomId}`);
    });

    socket.on("leaveRoom", ({ roomId }) => {
      socket.leave(roomId);
      console.log(`🔴 ${socket.id} left room: ${roomId}`);
    });

    socket.on("sendMessage", (msg) => {
      console.log(`📨 Message in ${msg.roomId}: ${msg.text}`);
      // ✅ Broadcast to everyone in room (including sender for easy sync)
      io.to(msg.roomId).emit("newMessage", msg);
    });
  });

  res.end();
}