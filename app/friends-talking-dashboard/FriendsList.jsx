"use client";

import { useEffect, useState } from "react";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch("/api/friends/friends");
      const data = await res.json();
      setFriends(data.friends || []);
    };
    fetchFriends();
  }, []);

  const startChat = async (email) => {
    const res = await fetch("/api/friends/private-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toEmail: email }),
    });
    const data = await res.json();
    if (data.roomId) {
      window.location.href = `/private-chat/${data.roomId}`;
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md mb-8">
      <h2 className="text-xl font-bold mb-4">Your Friends</h2>
      {friends.length === 0 ? (
        <p className="text-gray-400">No friends yet.</p>
      ) : (
        <ul className="space-y-4">
          {friends.map((f) => (
            <li
              key={f._id}
              className="bg-gray-800 p-4 rounded flex justify-between items-center"
            >
              <span>{f.name} ({f.email})</span>
              <button
                onClick={() => startChat(f.email)}
                className="px-3 py-1 text-xs bg-blue-600 rounded"
              >
                Chat
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}