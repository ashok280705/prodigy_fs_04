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
export async function PATCH(req, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roomId } = params;
  const { name } = await req.json();

  const room = await Room.findOne({ roomId });
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  // ✅ Check owner
  if (room.owner.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  room.name = name;
  await room.save();

  return NextResponse.json({ message: "Room updated", room });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roomId } = params;

  const room = await Room.findOne({ roomId });
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  if (room.owner.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await room.deleteOne();

  return NextResponse.json({ message: "Room deleted" });
}