'use server';

import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ChatRoom from "./ChatRoom";

export default async function Page({ params }) {
  const { roomId } = params; // ✅ No need to await

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();

  const room = await Room.findOne({ roomId });
  if (!room) redirect("/");

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-16 bg-black text-white">
      <div className="w-full max-w-5xl flex flex-col flex-1">
        <ChatRoom roomId={roomId} user={session.user} roomName={room.name} />
      </div>
    </main>
  );
}