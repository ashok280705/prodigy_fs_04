"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  MessageCircleMore,
  Home,
  User,
  Phone,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <MessageCircleMore className="w-7 h-7 text-blue-500" />
            <span className="text-xl font-bold">Chatify</span>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          <NavLink href="/dashboard" icon={<Home className="w-5 h-5" />}>
            Dashboard
          </NavLink>
          <NavLink href="/chat" icon={<MessageCircleMore className="w-5 h-5" />}>
            Chat Rooms
          </NavLink>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-1 bg-gray-800/70 px-4 py-2 rounded-full hover:bg-gray-700 transition"
            >
              <User className="w-5 h-5" />
              <span>Account</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-xl overflow-hidden backdrop-blur-md"
                >
                  <LinkItem href="/profile" icon={<User className="w-4 h-4" />} text="Profile" toggle={toggleDropdown} />
                  <LinkItem href="/contact" icon={<Phone className="w-4 h-4" />} text="Contact Us" toggle={toggleDropdown} />

                  {/* Logout as button */}
                  <button
                    onClick={async () => {
                      await signOut({ callbackUrl: "/login" });
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-3 hover:bg-gray-800/70 transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="ml-2">Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col bg-black border-t border-gray-700"
          >
            <MobileLink href="/dashboard" toggleMenu={toggleMenu}>
              Dashboard
            </MobileLink>
            <MobileLink href="/chat" toggleMenu={toggleMenu}>
              Chat Rooms
            </MobileLink>
            <div className="border-t border-gray-700">
              <MobileLink href="/profile" toggleMenu={toggleMenu}>
                Profile
              </MobileLink>
              <MobileLink href="/contact" toggleMenu={toggleMenu}>
                Contact Us
              </MobileLink>
              <button
                onClick={async () => {
                  await signOut({ callbackUrl: "/login" });
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 hover:bg-gray-800/70 transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, children, icon }) {
  return (
    <Link href={href} className="flex items-center gap-1 hover:text-blue-400 transition">
      {icon} {children}
    </Link>
  );
}

function LinkItem({ href, icon, text, toggle }) {
  return (
    <Link
      href={href}
      onClick={toggle}
      className="flex items-center px-4 py-3 hover:bg-gray-800/70 transition"
    >
      {icon}
      <span className="ml-2">{text}</span>
    </Link>
  );
}

function MobileLink({ href, children, toggleMenu }) {
  return (
    <Link
      href={href}
      onClick={toggleMenu}
      className="block px-4 py-3 hover:bg-gray-800/70 transition"
    >
      {children}
    </Link>
  );
}