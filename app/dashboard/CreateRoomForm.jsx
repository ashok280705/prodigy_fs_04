"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ CORRECT

export default function CreateRoomForm() {
  const router = useRouter(); // ✅

  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [friendEmail, setFriendEmail] = useState("");

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    if (!roomName.trim()) {
      alert("Room name is required");
      return;
    }

    if (!roomId.trim()) {
      alert("Room ID is required");
      return;
    }

    console.log("Sending Room ID:", roomId.trim());

    const res = await fetch("/api/room/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: roomName.trim(),
        roomId: roomId.trim(),
      }),
    });

    const data = await res.json();
    console.log("API Response:", data);

    if (res.ok && data?.room?.roomId) {
      alert("Room created successfully!");

      // ✅ Clear fields AFTER nav
      setRoomName("");
      setRoomId("");
    } else {
      alert(data.error || "Something went wrong.");
    }
  };

  const handleFindFriend = async (e) => {
    e.preventDefault();

    if (!friendEmail.trim()) {
      alert("Please enter your friend's email.");
      return;
    }

    alert(`Searching for: ${friendEmail}`);
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
          placeholder="Custom Room ID"
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
    
    </div>
  );
}