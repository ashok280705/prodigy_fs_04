"use client";
import { useState } from "react";
import { Send, Smile } from "lucide-react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex w-full mt-6">
        <div className="relative flex-grow">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your message..."
            className={`w-full px-6 py-4 pr-12 rounded-l-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white placeholder-gray-400 focus:outline-none border-2 transition-all duration-300 ${
              isFocused 
                ? 'border-green-500/50 shadow-lg shadow-green-500/10' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            <Smile size={20} />
          </button>
        </div>
        
        <button
          type="submit"
          disabled={!text.trim()}
          className={`px-6 py-4 rounded-r-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${
            text.trim()
              ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/25 transform hover:scale-105'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send size={18} className={`transition-transform duration-200 ${text.trim() ? 'hover:translate-x-1' : ''}`} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
      
      {/* Typing indicator placeholder */}
      <div className="mt-2 text-xs text-gray-500 h-4">
        {/* You can add typing indicator here if needed */}
      </div>
    </div>
  );
}