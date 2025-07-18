"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Registered successfully! You can now log in.");
      // ✅ Optionally redirect to login page
      window.location.href = "/auth/login";

    } catch (error) {
      console.error("Register error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-4">
      <motion.form
        onSubmit={handleSubmit}
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
            <UserPlus className="w-12 h-12 text-blue-500" />
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">Create your account</h2>

        <label className="block mb-2 text-sm font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
          required
        />

        <label className="block mb-2 text-sm font-semibold">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+1 234 567 890"
        />

        <label className="block mb-2 text-sm font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
          required
        />

        <label className="block mb-2 text-sm font-semibold">Confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
          required
        />

        <div className="flex items-start mb-6">
          <input type="checkbox" className="mr-2 mt-1" required />
          <span className="text-sm text-gray-300">
            I agree to the{" "}
            <Link href="#" className="underline hover:text-blue-400">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-blue-400">
              Privacy Policy
            </Link>
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 py-3 rounded-full font-semibold hover:bg-blue-700 transition mb-4 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline text-white hover:text-blue-400">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}