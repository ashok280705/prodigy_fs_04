"use client";

import { useEffect, useState } from "react";

export default function SentRequests() {
  const [sent, setSent] = useState([]);

  useEffect(() => {
    const fetchSent = async () => {
      const res = await fetch("/api/friends/sent");
      const data = await res.json();
      setSent(data.sent || []);
    };
    fetchSent();
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md mb-8">
      <h2 className="text-xl font-bold mb-4">Sent Requests</h2>
      {sent.length === 0 ? (
        <p className="text-gray-400">No sent requests.</p>
      ) : (
        <ul className="space-y-4">
          {sent.map((req) => (
            <li key={req._id} className="bg-gray-800 p-4 rounded">
              To: {req.to.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}