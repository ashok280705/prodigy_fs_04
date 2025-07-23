"use client";

import { useState } from "react";

export default function FindFriendBox() {
  const [email, setEmail] = useState("");
  const [found, setFound] = useState(null);

  const handleSearch = async () => {
    const res = await fetch("/api/friends/find", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setFound(data.user);
    } else {
      alert(data.error);
      setFound(null);
    }
  };

  const handleSendRequest = async () => {
    const res = await fetch("/api/friends/send-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toEmail: found.email }),
    });
    const data = await res.json();
    alert(data.message || data.error);
    setFound(null);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md mb-8">
      <h2 className="text-xl font-bold mb-4">Find a Friend</h2>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {found && (
        <div className="mt-4 bg-gray-800 p-4 rounded flex justify-between items-center">
          <span>{found.name} ({found.email})</span>
          <button
            onClick={handleSendRequest}
            className="px-3 py-1 text-xs bg-green-600 rounded"
          >
            Send Request
          </button>
        </div>
      )}
    </div>
  );
}