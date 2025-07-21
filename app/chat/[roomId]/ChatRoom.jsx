"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import getSocket from "@/lib/socket";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatRoom({ roomId, user }) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const router = useRouter();

  // Load messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/room/${roomId}/messages`);
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [roomId]);

  // Connect socket
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit("joinRoom", { roomId, user });

    socket.on("newMessage", (msg) => {
      if (msg.sender.id === user.id) return; // skip echo
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("newMessage");
    };
  }, [roomId, user]);

  // Send
  const sendMessage = async (text) => {
    const msg = {
      text,
      sender: { id: user.id, name: user.name },
      roomId,
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch(`/api/room/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
    } catch (err) {
      console.error("Failed to save message:", err);
    }

    socketRef.current.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
  };

  // Exit
  const handleExitRoom = () => {
    if (socketRef.current) socketRef.current.emit("leaveRoom", { roomId });
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-black to-gray-950 rounded-xl shadow-lg p-4 md:p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-2xl font-semibold">Chat Room</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExitRoom}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-transparent text-white font-semibold shadow hover:shadow-red-500/40 transition"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Exit Room</span>
        </motion.button>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden rounded-lg">
        <MessageList messages={messages} currentUser={user} />
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}