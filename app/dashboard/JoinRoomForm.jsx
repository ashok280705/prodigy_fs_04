"use client";

import { useState } from "react";

export default function JoinRoomForm() {
  const [roomId, setRoomId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim()) return;

    window.location.href = `/chat/${roomId}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-4">Join a Room</h2>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
      />
      <button
        type="submit"
        className="w-full bg-green-600 py-3 rounded hover:bg-green-700"
      >
        Join Room
      </button>
    </form>
  );
}