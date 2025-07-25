import { io } from "socket.io-client";

let socket;

export default function getSocket() {
  if (!socket) {
    socket = io({
      path: "/api/socket", // points to your API route
    });
  }
  return socket;
}