"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

import FindFriendBox from "./FindFriendBox";
import SentRequests from "./SentRequests";
import PendingRequests from "./PendingRequests";
import FriendsList from "./FriendsList";

export default function FriendsTalkingDashboard() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <>
      {/* Radial glow */}
       <div className="relative h-full w-[70vw] bg-slate-950">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[100vh] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
      </div>

      <main className="m-16 relative min-h-screen bg-transparent text-white px-4 py-12 overflow-x-hidden">
        {/* Extra radial layer */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-15%] top-[-20%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,128,255,.1),transparent)] blur-3xl" />
          <div className="absolute right-[-15%] bottom-[-20%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,128,.1),transparent)] blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto flex flex-col gap-8 z-10">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Find & Talk With Friends
            </h1>
            <p className="text-gray-400 text-lg">
              Search, connect & chat privately with Chatify
            </p>
          </motion.header>

          {/* Find Friend */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-black border border-gray-700 rounded-2xl p-6 shadow-lg backdrop-blur"
          >
            <h2 className="text-2xl font-semibold mb-4">🔍 Find Friends</h2>
            <FindFriendBox />
          </motion.section>

          {/* Sent Requests */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-black border border-gray-700 rounded-2xl p-6 shadow-lg backdrop-blur"
          >
            <h2 className="text-2xl font-semibold mb-4">📤 Sent Requests</h2>
            <SentRequests />
          </motion.section>

          {/* Pending Requests */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-black border border-gray-700 rounded-2xl p-6 shadow-lg backdrop-blur"
          >
            <h2 className="text-2xl font-semibold mb-4">📥 Pending Requests</h2>
            <PendingRequests />
          </motion.section>

          {/* Friends */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-black border border-gray-700 rounded-2xl p-6 shadow-lg backdrop-blur"
          >
            <h2 className="text-2xl font-semibold mb-4">👥 Your Friends</h2>
            <FriendsList />
          </motion.section>
        </div>
      </main>
    </>
  );
}