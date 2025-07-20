"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "@/components/MessageBubble";

export default function MessageList({ messages }) {
  const bottomRef = useRef(null);

  // Auto scroll to bottom when new messages come in
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-[60vh] overflow-y-auto p-4 space-y-2 bg-gray-900 rounded-md">
      <AnimatePresence initial={false}>
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <MessageBubble msg={msg} />
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}