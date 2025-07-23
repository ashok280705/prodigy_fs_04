'use server';

import dbConnect from "@/lib/db";
import PrivateRoom from "@/models/PrivateRoom";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ChatRoom from "../ChatRoom";

export default async function PrivateChatPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  const room = await PrivateRoom.findOne({ roomId: params.roomId });

  if (!room) redirect("/friends-talking-dashboard");

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <ChatRoom
          roomId={room.roomId}
          user={session.user}
          participants={room.participants}
        />
      </div>
    </main>
  );
}