"use client";

export default function MessageBubble({ msg }) {
  return (
    <div className="bg-gray-800 rounded-lg px-4 py-2 max-w-xs">
      <p className="text-sm font-semibold text-blue-400">{msg.sender.name}</p>
      <p className="text-white">{msg.text}</p>
    </div>
  );
}