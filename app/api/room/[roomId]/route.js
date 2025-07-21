// /api/room/[roomId]/route.js

import dbConnect from "@/lib/db";
import Room from "@/models/Room";

// ✅ GET a single room info
export async function GET(_req, { params }) {
  const { roomId } = params;

  await dbConnect();

  const room = await Room.findOne({ roomId });

  if (!room) {
    return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ room }), { status: 200 });
}

// ✅ DELETE an entire room (optional!)
export async function DELETE(_req, { params }) {
  const { roomId } = params;

  await dbConnect();

  const result = await Room.deleteOne({ roomId });

  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ error: "Room not found or already deleted" }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}