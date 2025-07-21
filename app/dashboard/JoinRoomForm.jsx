"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinRoomForm() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim()) return;

    router.push(`/chat/${roomId.trim()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black p-8 rounded-xl border border-gray-800 shadow-2xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-white text-center">
        Join Room
      </h2>
      
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full p-4 mb-6 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors duration-200"
      />
      
      <button
        type="submit"
        className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        Join Room
      </button>
    </form>
  );
}