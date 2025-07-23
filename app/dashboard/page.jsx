"use client";

import { useEffect, useState } from "react";
import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [rooms, setRooms] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") redirect("/login");

    const fetchRooms = async () => {
      const res = await fetch("/api/room/my");
      const data = await res.json();
      console.log("✅ Rooms from API:", data.rooms);
      setRooms(data.rooms || []);
      setTimeout(() => setIsLoaded(true), 100); // Trigger animations
    };

    fetchRooms();
  }, [status]);

  const handleDelete = async (roomId) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    const res = await fetch(`/api/room/${roomId}`, { method: "DELETE" });

    if (res.ok) {
      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
      alert("Room deleted!");
    } else {
      const err = await res.json();
      alert(err.error || "Failed to delete room");
    }
  };

  return (
    <>
      <div className="relative h-full w-[70vw] bg-slate-950">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[100vh] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
      </div>

      <div className="min-h-screen bg-black text-white overflow-x-hidden m-16">
        {/* Header */}
        <div
          className={`max-w-6xl mx-auto mb-8 p-4 md:p-8 transform transition-all duration-700 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Chatify Dashboard
          </h1>
          <p className="text-gray-400">Create and manage your rooms</p>
        </div>

        {/* Forms Section */}
        <div className="max-w-6xl mx-auto mb-12 p-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className={`bg-transparent border border-gray-800 rounded-lg p-6 transform transition-all duration-500 delay-200 ${
                isLoaded
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-8 opacity-0 scale-95"
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">Create Room</h2>
              <CreateRoomForm />
            </div>

            <div
              className={`bg-black-900 border border-gray-800 rounded-lg p-6 transform transition-all duration-500 delay-300 ${
                isLoaded
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-8 opacity-0 scale-95"
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">Join Room</h2>
              <JoinRoomForm />
            </div>
          </div>
        </div>
        {/* Talk With Friends Button */}
        <div className="max-w-6xl mx-auto mb-12 px-4 md:px-8 text-center">
          <button
            onClick={() =>
              (window.location.href = "/friends-talking-dashboard")
            }
            className="
      inline-flex items-center gap-2 
      px-8 py-3 
      bg-gradient-to-r from-purple-600 to-pink-600 
      text-white font-semibold 
      rounded-full 
      shadow-lg 
      hover:from-purple-700 hover:to-pink-700 
      hover:shadow-pink-500/40 
      transition-all duration-300 transform 
      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500
    "
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
              />
            </svg>
            Talk With Friends
          </button>
        </div>
        {/* Your Rooms Section */}
        <div className="max-w-6xl mx-auto p-4 md:px-8">
          <div
            className={` border border-gray-800 rounded-lg transform transition-all duration-500 delay-400 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold">Your Rooms</h2>
              <p className="text-gray-400 text-sm mt-1">{rooms.length} rooms</p>
            </div>

            <div className="p-6">
              {rooms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-2 animate-pulse">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400">No rooms yet</p>
                  <p className="text-gray-500 text-sm">
                    Create your first room to get started
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop/Tablet */}
                  <div className="hidden sm:block">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {rooms.map((room, index) => (
                        <div
                          key={room.roomId || index}
                          className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/50 transition-all duration-300 group transform ${
                            isLoaded
                              ? "translate-y-0 opacity-100 scale-100"
                              : "translate-y-8 opacity-0 scale-95"
                          } hover:scale-105`}
                          style={{ animationDelay: `${500 + index * 100}ms` }}
                        >
                          <div className="aspect-video bg-gradient-to-r from-black to-purple-900 flex items-center justify-center group-hover:from-black group-hover:to-purple-600 transition-all duration-300">
                            <svg
                              className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                          </div>

                          <div className="p-4">
                            <h3 className="font-semibold text-white mb-2 truncate">
                              {room.name}
                            </h3>
                            {room.roomId && (
                              <p className="text-xs text-gray-400 mb-4 truncate">
                                ID: {room.roomId}
                              </p>
                            )}
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDelete(room.roomId)}
                                className="flex-1 px-3 py-2 text-sm text-red-400 border border-red-400/30 rounded hover:bg-red-400/10 hover:border-red-400/50 transition-all duration-200 transform hover:scale-105"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="sm:hidden">
                    <div className="overflow-x-auto pb-4">
                      <div
                        className="flex space-x-4"
                        style={{ minWidth: "max-content" }}
                      >
                        {rooms.map((room, index) => (
                          <div
                            key={room.roomId || index}
                            className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 hover:shadow-lg transition-all duration-300 group flex-shrink-0 w-64 transform ${
                              isLoaded
                                ? "translate-y-0 opacity-100 scale-100"
                                : "translate-y-8 opacity-0 scale-95"
                            }`}
                            style={{ animationDelay: `${500 + index * 100}ms` }}
                          >
                            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300">
                              <svg
                                className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                            </div>

                            <div className="p-4">
                              <h3 className="font-semibold text-white mb-2 truncate">
                                {room.name}
                              </h3>
                              {room.roomId && (
                                <p className="text-xs text-gray-400 mb-4 truncate">
                                  ID: {room.roomId}
                                </p>
                              )}
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleDelete(room.roomId)}
                                  className="flex-1 px-3 py-2 text-sm text-red-400 border border-red-400/30 rounded hover:bg-red-400/10 hover:border-red-400/50 transition-all duration-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
