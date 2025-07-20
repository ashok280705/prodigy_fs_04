'use server';

import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ChatRoom from "./ChatRoom";

export default async function Page({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  const room = await Room.findOne({ roomId: params.roomId });

  if (!room) redirect("/");

  return (
    <div className=" pt-[10vh] min-h-[100vh] bg-black text-white flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-4">Room: {room.name}</h1>
      <ChatRoom roomId={params.roomId} user={session.user} />
    </div>
  );
}