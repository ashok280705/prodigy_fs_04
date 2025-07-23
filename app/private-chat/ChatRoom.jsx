"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getSocket from "@/lib/socket";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function PrivateChatRoom({ roomId, user }) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const router = useRouter();

  // ✅ Load messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/private-messages/${roomId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    };
    fetchMessages();
  }, [roomId]);

  // ✅ Connect socket for private room
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit("joinPrivateRoom", { roomId });

    socket.on("newPrivateMessage", (msg) => {
      console.log("Got private message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leavePrivateRoom", { roomId });
      socket.off("newPrivateMessage");
    };
  }, [roomId]);

  // ✅ Send a private message
  const sendMessage = async (text) => {
    const msg = {
      text,
      sender: { id: user.id, name: user.name },
      roomId,
    };

    const res = await fetch(`/api/private-messages/${roomId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });

    const data = await res.json();
    const savedMsg = data.message;

    socketRef.current.emit("sendPrivateMessage", savedMsg);
    setMessages((prev) => [...prev, savedMsg]);
  };

  // ✅ Leave room handler
  const handleLeaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("leavePrivateRoom", { roomId });
      socketRef.current.off("newPrivateMessage");
    }
    router.push("/friends-talking-dashboard");
  };

  return (
    <>
      <div className="m-16 relative h-full w-full bg-slate-950">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
      </div>

      <div className="p-6 bg-black text-white min-h-screen flex flex-col">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">Private Chat</h1>
          <button
            onClick={handleLeaveRoom}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Leave
          </button>
        </div>

        <MessageList messages={messages} currentUser={user} />
        <ChatInput onSend={sendMessage} />
      </div>
    </>
  );
}