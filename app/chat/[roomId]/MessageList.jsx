"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, Trash2, User } from "lucide-react";

export default function MessageList({
  messages,
  currentUser,
  onDeleteForMe = () => {}, // fallback default
  onDeleteForEveryone,
}) {
  const bottomRef = useRef(null);
  const [showOptionsId, setShowOptionsId] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="flex flex-col gap-1 overflow-y-auto overflow-x-hidden px-4 py-6 bg-gradient-to-b from-gray-950 to-black rounded-2xl border border-gray-800/50 h-[70vh] backdrop-blur-sm">
      <AnimatePresence initial={false}>
        {messages.map((msg, idx) => {
          const isMine =
            msg.sender?.id?.toString() === currentUser?.id?.toString() ||
            msg.sender?.name?.toLowerCase() === currentUser?.name?.toLowerCase();

          const isConsecutive =
            idx > 0 &&
            messages[idx - 1].sender?.name === msg.sender?.name;

          return (
            <motion.div
              key={`message-${msg._id || idx}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              className={`w-full flex ${isConsecutive ? "mt-1" : "mt-4"}`}
            >
              <div
                className={`w-full flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[80%] ${
                    isMine ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {!isConsecutive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isMine
                          ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                          : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                      }`}
                    >
                      {getInitials(msg.sender?.name || "U")}
                    </motion.div>
                  )}

                  <div
                    className={`${
                      isConsecutive ? (isMine ? "mr-10" : "ml-10") : ""
                    } w-full relative`}
                  >
                    {!isConsecutive && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className={`text-xs font-semibold mb-1 px-1 ${
                          isMine
                            ? "text-right text-green-400"
                            : "text-left text-blue-400"
                        }`}
                      >
                        {isMine ? "You" : msg.sender?.name || "Unknown"}
                      </motion.p>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`relative px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm ${
                        isMine
                          ? "bg-gradient-to-br from-green-600 to-green-700 text-white shadow-green-500/20"
                          : "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 shadow-black/30 border border-gray-700/50"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words overflow-wrap break-word">
                        {msg.deleted ? (
                          <i className="text-gray-400 italic">
                            This message was deleted.
                          </i>
                        ) : (
                          msg.text || "No content"
                        )}
                      </p>

                      <div
                        className={`flex items-center gap-1 mt-2 ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className="text-[10px] text-gray-300/70">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "--:--"}
                        </span>
                        {isMine && !msg.deleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <CheckCheck
                              size={12}
                              className="text-gray-300/70"
                            />
                          </motion.div>
                        )}
                      </div>

                      {isMine && !msg.deleted && (
                        <div className="absolute top-1 right-1">
                          <button
                            onClick={() =>
                              showOptionsId === msg._id
                                ? setShowOptionsId(null)
                                : setShowOptionsId(msg._id)
                            }
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>

                          {showOptionsId === msg._id && (
                            <div className="absolute right-0 mt-1 w-40 bg-gray-900 border border-gray-700 rounded shadow-md z-50">
                              <button
                                onClick={() => {
                                  onDeleteForMe(msg._id);
                                  setShowOptionsId(null);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-sm"
                              >
                                Delete for me
                              </button>
                              <button
                                onClick={() => {
                                  onDeleteForEveryone(msg._id);
                                  setShowOptionsId(null);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-sm"
                              >
                                Delete for everyone
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {!isConsecutive && (
                        <div
                          className={`absolute bottom-0 ${
                            isMine
                              ? "right-0 transform translate-x-1 translate-y-1"
                              : "left-0 transform -translate-x-1 translate-y-1"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 ${
                              isMine
                                ? "bg-gradient-to-br from-green-600 to-green-700"
                                : "bg-gradient-to-br from-gray-800 to-gray-900 border-l border-b border-gray-700/50"
                            } transform rotate-45`}
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div ref={bottomRef} />

      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-full text-gray-500"
        >
          <User size={48} className="mb-4 text-gray-600" />
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm text-gray-600">Start a conversation!</p>
        </motion.div>
      )}
    </div>
  );
}