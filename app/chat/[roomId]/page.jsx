'use server';

import ChatRoom from "./ChatRoom";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ChatRoomPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }

  await dbConnect();

  const room = await Room.findById(params.roomId).populate("members", "name email");

  if (!room) {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Room: {room.name}</h1>
      <ChatRoom roomId={params.roomId} user={session.user} />
    </div>
  );
}