"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  const handleGoogle = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-4">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ rotate: -20, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "backOut" }}
          >
            <Lock className="w-12 h-12 text-blue-500" />
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">Sign in to Chat</h2>

        <label className="block mb-2 text-sm font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
          required
        />

        <label className="block mb-2 text-sm font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 py-3 rounded-full font-semibold hover:bg-blue-700 transition mb-4"
        >
          Sign in
        </button>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.15 0 5.95 1.05 8.18 2.97l6.1-6.1C34.22 3.06 29.39 1 24 1 14.61 1 6.55 6.86 2.91 15.09l7.47 5.8C12.05 14.41 17.6 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.55c0-1.64-.15-3.22-.42-4.75H24v9h12.5c-.54 2.87-2.18 5.31-4.65 6.98l7.1 5.48c4.16-3.85 6.57-9.53 6.57-16.71z"
            />
            <path
              fill="#FBBC05"
              d="M10.38 28.23A14.5 14.5 0 0 1 9.5 24c0-1.47.25-2.88.7-4.23l-7.47-5.8A23.93 23.93 0 0 0 1 24c0 3.75.88 7.3 2.42 10.47l7.48-5.8z"
            />
            <path
              fill="#EA4335"
              d="M24 46c6.39 0 11.75-2.12 15.66-5.75l-7.1-5.48c-2.04 1.37-4.64 2.23-8.56 2.23-6.39 0-11.84-4.91-13.56-11.52l-7.48 5.8C6.55 41.14 14.61 46 24 46z"
            />
            <path fill="none" d="M1 1h46v46H1z" />
          </svg>
          Sign in with Google
        </button>

        <p className="text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="underline text-white hover:text-blue-400">
            Sign up here
          </Link>
        </p>
      </motion.form>
    </div>
  );
}