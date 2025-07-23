"use client";

import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-3 rounded bg-gray-800 text-white"
      />
      <button
        type="submit"
        className="px-4 py-3 bg-green-600 rounded text-white hover:bg-green-700"
      >
        Send
      </button>
    </form>
  );
}