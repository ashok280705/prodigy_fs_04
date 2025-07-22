"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") redirect("/login");

    const fetchProfile = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      setProfile({ ...profile, ...data });
      setLoading(false);
    };

    fetchProfile();
  }, [status]);

  const handleUpdate = async () => {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profile.name,
        phone: profile.phone,
        password: profile.password,
      }),
    });

    if (res.ok) {
      alert("Profile updated ✅");
      setProfile({ ...profile, password: "" }); // Clear password field
    } else {
      alert("Failed to update ❌");
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <>
     <div className="fixed inset-0 z-0 bg-black">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[100vh] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
      </div>
<main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-950/80 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-2">Your Profile</h1>
        <p className="text-center text-gray-400 mb-6">
          View & update your profile information
        </p>

        <div className="space-y-4">
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-gray-400">Name</span>
            <input
              className="p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              placeholder="Your name"
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 text-gray-400">Email</span>
            <input
              className="p-3 bg-gray-800 rounded-lg cursor-not-allowed opacity-60"
              value={profile.email}
              disabled
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 text-gray-400">Phone</span>
            <input
              className="p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              maxLength={10}
              placeholder="1234567890"
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 text-gray-400">New Password</span>
            <input
              type="password"
              className="p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={profile.password}
              onChange={(e) =>
                setProfile({ ...profile, password: e.target.value })
              }
              placeholder="Leave blank to keep current"
            />
          </label>

          <button
            onClick={handleUpdate}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            Save Changes
          </button>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <label className="flex flex-col">
          Name:
          <input
            className="p-2 bg-gray-800 rounded mt-1"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </label>

        <label className="flex flex-col">
          Email:
          <input
            className="p-2 bg-gray-800 rounded mt-1"
            value={profile.email}
            disabled
          />
        </label>

        <label className="flex flex-col">
          Phone:
          <input
            className="p-2 bg-gray-800 rounded mt-1"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            maxLength={10}
            minLength={10}
            placeholder="1234567890"
          />
        </label>

        <label className="flex flex-col">
          New Password:
          <input
            type="password"
            className="p-2 bg-gray-800 rounded mt-1"
            value={profile.password}
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            placeholder="Leave blank to keep current"
          />
        </label>

        <button
          onClick={handleUpdate}
          className="mt-4 px-4 py-2 bg-blue-600 rounded"
        >
          Save Changes
        </button>
      </div>
    </main>
    </>
  );
}