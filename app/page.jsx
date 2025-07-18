"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react"; // Nice icon

export default function GetStarted() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black to-gray-900 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="flex justify-center mb-6"
        >
          <MessageSquare className="w-16 h-16 text-blue-500" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Connect & Chat Instantly
        </h1>

        <p className="mb-10 text-gray-300 max-w-md mx-auto">
          Create your chat room or join your friends in seconds. Secure, fast, and real-time.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <Link href="/register">
            <button className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-full font-semibold shadow-lg">
              Sign Up
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-white text-black hover:bg-gray-200 transition px-8 py-3 rounded-full font-semibold shadow-lg">
              Sign In
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}