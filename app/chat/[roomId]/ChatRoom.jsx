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

  // ✅ Load all messages for this room from DB
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

  // ✅ Connect socket & listen for real-time messages and deletes
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit("joinRoom", { roomId, user });

    socket.on("newMessage", (msg) => {
      if (msg.sender.id === user.id) return; // skip echo
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("deleteMessageForEveryone", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, deleted: true, text: "" } : msg
        )
      );
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("newMessage");
      socket.off("deleteMessageForEveryone");
    };
  }, [roomId, user]);

  // ✅ Send new message: saves to DB → broadcasts → updates local state
  const sendMessage = async (text) => {
    const payload = {
      text,
      sender: { id: user.id, name: user.name },
      roomId,
    };

    try {
      const res = await fetch(`/api/room/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const savedMsg = data.message;

      // Broadcast to others
      socketRef.current.emit("sendMessage", savedMsg);

      // Update local instantly
      setMessages((prev) => [...prev, savedMsg]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // ✅ Delete message for everyone: DB + broadcast + local update
  const handleDeleteForEveryone = async (messageId) => {
    const ok = confirm("Delete for everyone?");
    if (!ok) return;

    try {
      await fetch(`/api/room/${roomId}/messages`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, mode: "everyone" }),
      });

      socketRef.current.emit("deleteMessageForEveryone", { messageId, roomId });

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, deleted: true, text: "" } : msg
        )
      );
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

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
        <MessageList
          messages={messages}
          currentUser={user}
          onDeleteForEveryone={handleDeleteForEveryone}
        />
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}