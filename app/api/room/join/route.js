// app/api/room/join/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = await req.json();

  if (!roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
  }

  const room = await Room.findById(roomId);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const user = await User.findOne({ email: session.user.email });

  if (room.members.includes(user._id)) {
    return NextResponse.json({ message: "Already joined", room });
  }

  room.members.push(user._id);
  await room.save();

  return NextResponse.json({ message: "Joined room", room });
}