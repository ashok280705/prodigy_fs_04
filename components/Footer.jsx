"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircleMore, Github, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 px-6 py-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo & Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <MessageCircleMore className="w-6 h-6 text-blue-500" />
          <span className="font-semibold text-white text-lg">Chatify</span>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col md:flex-row items-center gap-6"
        >
          <Link href="/privacy" className="hover:text-blue-400 transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-blue-400 transition">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-blue-400 transition">
            Contact Us
          </Link>
        </motion.div>

        {/* Social / Contact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex space-x-4"
        >
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            <Github className="w-5 h-5" />
          </a>
          <a href="mailto:support@chatify.com" className="hover:text-blue-400 transition">
            <Mail className="w-5 h-5" />
          </a>
          <a href="tel:+1234567890" className="hover:text-blue-400 transition">
            <Phone className="w-5 h-5" />
          </a>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-center text-sm mt-6 text-gray-600"
      >
        &copy; {new Date().getFullYear()} Chatify. All rights reserved.
      </motion.p>
    </footer>
  );
}
