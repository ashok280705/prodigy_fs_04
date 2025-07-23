"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import getSocket from "@/lib/socket";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ChatRoom({ roomId, user, roomName }) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/room/${roomId}/messages`);
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        toast.error("Failed to load messages.");
      }
    };
    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit("joinRoom", { roomId, user });

    socket.on("newMessage", (msg) => {
      if (msg.sender.id === user.id) return;
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("deleteMessageForEveryone", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, deleted: true, text: "" } : msg
        )
      );
      toast("A message was deleted for everyone.", { icon: "🗑️" });
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("newMessage");
      socket.off("deleteMessageForEveryone");
    };
  }, [roomId, user]);

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

      socketRef.current.emit("sendMessage", savedMsg);
      setMessages((prev) => [...prev, savedMsg]);
      toast.success("Message sent!");
    } catch (err) {
      toast.error("Failed to send message.");
    }
  };

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

      toast.success("Message deleted for everyone!");
    } catch (err) {
      toast.error("Failed to delete message.");
    }
  };

  const handleExitRoom = () => {
    if (socketRef.current) socketRef.current.emit("leaveRoom", { roomId });
    toast("You left the room.", { icon: "👋" });
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-black to-gray-950 rounded-xl shadow-lg p-4 md:p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-2xl font-semibold">{roomName || "Chat Room"}</h2>
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