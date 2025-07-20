"use client";

import { useState } from "react";

export default function CreateRoomForm() {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [friendEmail, setFriendEmail] = useState("");

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    const res = await fetch("/api/room/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: roomName, roomId }),
    });

    const data = await res.json();

    if (data?.room?.roomId) {
      window.location.href = `/chat/${data.room.roomId}`;
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  const handleFindFriend = async (e) => {
    e.preventDefault();
    if (!friendEmail.trim()) return;

    // For now, just navigate or log — you’d implement invite logic in a real app
    alert(`This would search for: ${friendEmail}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Create Room */}
      <form
        onSubmit={handleCreateRoom}
        className="flex-1 bg-gray-900 p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">Create a Room</h2>

        <input
          type="text"
          placeholder="Room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Custom Room ID (optional)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 py-3 rounded hover:bg-blue-700 font-semibold transition"
        >
          Create Room
        </button>
      </form>

      {/* Find Friend */}
      <form
        onSubmit={handleFindFriend}
        className="flex-1 bg-gray-900 p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">Find a Friend to Chat</h2>

        <input
          type="email"
          placeholder="Friend's email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-green-600 py-3 rounded hover:bg-green-700 font-semibold transition"
        >
          Find Friend
        </button>
      </form>
    </div>
  );
}