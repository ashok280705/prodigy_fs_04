"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function ChatroomPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/room/all");
        const data = await res.json();
        setRooms(data.rooms || []);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    fetchRooms();
  }, []);

  const handleJoin = async (roomId) => {
    try {
      const res = await fetch("/api/room/joinall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Redirect to room page
        window.location.href = `/chat/${roomId}`;
      } else {
        alert(data.error || "Failed to join room.");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 bg-black">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[100vh] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen text-white mt-16 container mx-auto">
        {/* Header */}
        <div className={`p-4 md:p-8 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">All Chat Rooms</h1>
          <p className="text-gray-400">Join any room to start chatting</p>
        </div>

        {/* Content Area */}
        <div className="px-4 md:px-8 pb-8">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                <p>Loading rooms...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && rooms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-16 w-16 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">No rooms available</p>
              <p className="text-gray-500 text-sm mt-1">Check back later for new rooms</p>
            </div>
          )}

          {/* Rooms Grid - Desktop/Tablet */}
          {!loading && rooms.length > 0 && (
            <>
              <div className="hidden sm:block">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl">
                  {rooms.map((room, index) => (
                    <div
                      key={room._id}
                      className={`group bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 transform ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'} hover:scale-105`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Room Header with Gradient */}
                      <div className="h-32 bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-600/10 group-hover:from-pink-500/20 group-hover:to-purple-600/20 transition-all duration-300"></div>
                        <div className="relative z-10 text-center">
                          <div className="w-12 h-12 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-2M3 4h6v4H3z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Room Content */}
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-white mb-2 truncate group-hover:text-pink-300 transition-colors">
                          {room.name}
                        </h2>
                        <p className="text-sm text-gray-400 mb-6 truncate">
                          ID: {room.roomId}
                        </p>

                        {/* Join Button */}
                        <button
                          onClick={() => handleJoin(room.roomId)}
                          className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-400 hover:to-purple-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
                        >
                          Join Room
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Horizontal Scroll */}
              <div className="sm:hidden">
                <div className="overflow-x-auto pb-4">
                  <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
                    {rooms.map((room, index) => (
                      <div
                        key={room._id}
                        className={`group bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 flex-shrink-0 w-72 transform ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Room Header */}
                        <div className="h-24 bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-600/10 group-hover:from-pink-500/20 group-hover:to-purple-600/20 transition-all duration-300"></div>
                          <div className="relative z-10">
                            <div className="w-10 h-10 mx-auto bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-2M3 4h6v4H3z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Room Content */}
                        <div className="p-4">
                          <h2 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-pink-300 transition-colors">
                            {room.name}
                          </h2>
                          <p className="text-xs text-gray-400 mb-4 truncate">
                            ID: {room.roomId}
                          </p>

                          {/* Join Button */}
                          <button
                            onClick={() => handleJoin(room.roomId)}
                            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-400 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
                          >
                            Join Room
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scroll Indicators */}
                {rooms.length > 0 && (
                  <div className="flex justify-center mt-2">
                    <div className="flex space-x-1">
                      {rooms.map((_, index) => (
                        <div key={index} className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, rgba(236, 72, 153, 0.5), rgba(147, 51, 234, 0.5));
          border-radius: 3px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, rgba(236, 72, 153, 0.8), rgba(147, 51, 234, 0.8));
        }
      `}</style>
    </>
  );
}