import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = await req.json();

  if (!roomId) {
    return NextResponse.json({ error: "Room ID required" }, { status: 400 });
  }

  const room = await Room.findOne({ roomId });
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const userId = session.user.id;

  if (!room.members.includes(userId)) {
    room.members.push(userId);
    await room.save();
  }

  return NextResponse.json({ message: `Joined room ${roomId}` });
}