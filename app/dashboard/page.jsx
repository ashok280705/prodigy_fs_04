"use client";

import { useEffect, useState } from "react";
import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") redirect("/login");

    const fetchRooms = async () => {
      const res = await fetch("/api/room/my");
      const data = await res.json();
      console.log("✅ Rooms from API:", data.rooms);
      setRooms(data.rooms || []);
    };

    fetchRooms();
  }, [status]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome to Chatify Dashboard</h1>

      <div className="w-full max-w-md flex flex-col gap-6">
        <CreateRoomForm />
        <JoinRoomForm />

        <div className="mt-8 w-full">
          <h2 className="text-xl font-bold mb-4">Your Created Rooms</h2>
          {rooms.length === 0 ? (
            <p className="text-gray-400">You haven’t created any rooms yet.</p>
          ) : (
            <ul className="space-y-4">
              {rooms.map((room) => (
                <li
                  key={room._id}
                  className="flex justify-between items-center p-4 bg-gray-800 rounded"
                >
                  <span>{room.name}</span>
                  <div className="flex gap-2">
                    {/* Replace with actual handlers */}
                    <button className="px-3 py-1 text-xs bg-blue-600 rounded">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs bg-red-600 rounded">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}