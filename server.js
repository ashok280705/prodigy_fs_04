const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handler(req, res);
  });

  const io = new Server(httpServer, {
    path: "/api/socket",
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // ✅ PUBLIC rooms
    socket.on("joinRoom", ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on("sendMessage", (msg) => {
      io.to(msg.roomId).emit("newMessage", msg);
    });

    socket.on("deleteMessageForEveryone", ({ messageId, roomId }) => {
      socket.to(roomId).emit("deleteMessageForEveryone", { messageId });
    });

    // ✅ ✅ PRIVATE rooms
    socket.on("joinPrivateRoom", ({ roomId }) => {
      console.log(`Socket ${socket.id} joined private room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendPrivateMessage", (msg) => {
      console.log(`Private message:`, msg);
      socket.to(msg.roomId).emit("newPrivateMessage", msg);
    });

    socket.on("leavePrivateRoom", ({ roomId }) => {
      socket.leave(roomId);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
