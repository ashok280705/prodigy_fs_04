"use client";

import { useEffect, useState, useRef } from "react";
import getSocket from "@/lib/socket";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatRoom({ roomId, user }) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  // ✅ 1️⃣ Load messages once
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

  // ✅ 2️⃣ Connect to Socket.IO
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit("joinRoom", { roomId, user });

    socket.on("newMessage", (msg) => {
      // ✅ Prevent duplicate: skip if it’s yours
      if (msg.sender.id === user.id) return;
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("newMessage");
    };
  }, [roomId, user]);

  // ✅ 3️⃣ Send message
  const sendMessage = async (text) => {
    const msg = {
      text,
      sender: { id: user.id, name: user.name }, // 👈 Make sure ID is here!
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

    // ✅ Optimistic update
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="flex flex-col h-full bg-black rounded-lg shadow-lg p-4">
      <MessageList messages={messages} currentUser={user} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
}