// server.js
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

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    socket.on("joinRoom", ({ roomId, user }) => {
      socket.join(roomId);
      console.log(`${user.name} joined room: ${roomId}`);
    });

    socket.on("sendMessage", (msg) => {
      io.to(msg.roomId).emit("newMessage", msg);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});