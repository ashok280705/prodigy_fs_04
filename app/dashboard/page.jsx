'use client';
import { useEffect } from "react";
import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
export default function DashboardPage() {
   const { data: session, status } = useSession();
    useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") redirect("/login");
  }, [status]);
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome to Chatify Dashboard</h1>
      <div className="w-full max-w-md flex flex-col gap-6">
        <CreateRoomForm />
        <JoinRoomForm />
      </div>
    </main>
  );
}