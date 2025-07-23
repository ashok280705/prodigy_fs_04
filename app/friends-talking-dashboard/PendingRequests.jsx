"use client";

import { useEffect, useState } from "react";

export default function PendingRequests() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      const res = await fetch("/api/friends/pending");
      const data = await res.json();
      setPending(data.pending || []);
    };
    fetchPending();
  }, []);

  const handleAccept = async (id) => {
    const res = await fetch("/api/friends/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: id }),
    });
    const data = await res.json();
    alert(data.message);
    setPending((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md mb-8">
      <h2 className="text-xl font-bold mb-4">Pending Friend Requests</h2>
      {pending.length === 0 ? (
        <p className="text-gray-400">No pending requests.</p>
      ) : (
        <ul className="space-y-4">
          {pending.map((req) => (
            <li
              key={req._id}
              className="bg-gray-800 p-4 rounded flex justify-between items-center"
            >
              <span>{req.from.email}</span>
              <button
                onClick={() => handleAccept(req._id)}
                className="px-3 py-1 text-xs bg-green-600 rounded"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}