"use client";

import { useEffect, useRef } from "react";

export default function MessageList({ messages, currentUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
    <div className="relative h-full w-full bg-slate-950"><div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div><div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div></div>
    <div className="flex flex-col gap-4 overflow-y-auto h-[70vh] px-4 py-6 bg-gradient-to-b from-black to-gray-950 rounded-2xl border border-gray-800 backdrop-blur-sm">
      {messages.map((msg, idx) => {
        const isMine =
          msg.sender?.id?.toString() === currentUser?.id?.toString();

        return (
          <div
            key={idx}
            className={`relative max-w-[70%] px-4 py-3 rounded-2xl shadow-lg ${
              isMine
                ? "ml-auto bg-gradient-to-br from-green-600 to-green-700 text-white shadow-green-500/20"
                : "mr-auto bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 shadow-black/30"
            }`}
          >
            {/* Bubble text */}
            <p className="text-sm leading-relaxed break-words">{msg.text}</p>

            {/* Name & time */}
            <div className="flex justify-between items-center mt-2 text-xs text-gray-300">
              <span>{isMine ? "You" : msg.sender?.name || "Unknown"}</span>
              <span>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                   hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Bubble tail */}
            <div
              className={`absolute bottom-0 ${
                isMine
                  ? "right-0 translate-x-1 translate-y-1"
                  : "left-0 -translate-x-1 translate-y-1"
              }`}
            >
              <div
                className={`w-3 h-3 ${
                  isMine
                    ? "bg-gradient-to-br from-green-600 to-green-700"
                    : "bg-gradient-to-br from-gray-800 to-gray-900"
                } transform rotate-45`}
              />
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-8">
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm text-gray-600">Start chatting now!</p>
        </div>
      )}
    </div>
    </>
  );
}