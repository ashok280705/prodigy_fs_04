import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET
export async function GET(_req, { params }) {
  const { roomId } = await params;

  await dbConnect();

  const room = await Room.findOne({ roomId });

  if (!room) {
    return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ room }), { status: 200 });
}

// PATCH


// DELETE
export async function DELETE(req, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = await params;
  const room = await Room.findOne({ roomId });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (!room.createdBy) {
    return NextResponse.json({ error: "Room has no owner" }, { status: 500 });
  }

  if (room.createdBy.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await room.deleteOne();

  return NextResponse.json({ message: "Room deleted" });
}