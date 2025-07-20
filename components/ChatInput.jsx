"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Send to parent (or Socket.IO)
    onSend(message.trim());

    // Clear input
    setMessage("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center bg-gray-800 px-4 py-3 rounded-full shadow-md w-full"
    >
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none px-2"
      />
      <button
        type="submit"
        className="ml-3 p-2 rounded-full hover:bg-gray-700 transition"
      >
        <SendHorizonal className="w-5 h-5 text-blue-500" />
      </button>
    </motion.form>
  );
}