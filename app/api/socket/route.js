// app/api/socket/route.js

import { Server } from "socket.io";

export const config = {
  runtime: "nodejs", // ⬅️ CRUCIAL: disables Edge runtime!
};

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 New Socket.IO server...");
    io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("✅ New client connected");

      socket.on("joinRoom", ({ roomId, user }) => {
        socket.join(roomId);
        console.log(`${user.name} joined room ${roomId}`);
      });

      socket.on("sendMessage", (msg) => {
        io.to(msg.roomId).emit("newMessage", msg);
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected");
      });
    });
  } else {
    console.log("➡️ Socket.IO server already running");
  }

  res.end();
}