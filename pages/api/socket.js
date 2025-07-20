import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 New Socket.IO server...");
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.on("joinRoom", ({ roomId, user }) => {
        socket.join(roomId);
        console.log(`${user.name} joined room ${roomId}`);
      });

      socket.on("sendMessage", ({ roomId, text, sender }) => {
        io.to(roomId).emit("newMessage", {
          text,
          sender,
          timestamp: Date.now(),
        });
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}