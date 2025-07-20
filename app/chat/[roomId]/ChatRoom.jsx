"use client";

import { useEffect, useState, useRef } from "react";
import getSocket from "@/lib/socket"; // Use your singleton helper!
import MessageList from "./MessageList";
import ChatInput from "@/components/ChatInput";

export default function ChatRoom({ roomId, user }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Get or create socket once
    const socket = getSocket();
    socketRef.current = socket;

    // Join the room
    socket.emit("joinRoom", { roomId, user });

    // Listen for new messages
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup listeners only (do NOT disconnect here!)
    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("newMessage");
    };
  }, [roomId, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const msg = {
      text,
      sender: { id: user.id, name: user.name },
      roomId,
    };

    socketRef.current.emit("sendMessage", msg);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-4">
      <div className="flex-grow overflow-y-auto mb-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}