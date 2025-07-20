// ✅ app/api/room/[roomId]/messages/route.js

import dbConnect from "@/lib/db";
import Room from "@/models/Room";

export async function POST(req, { params }) {
  await dbConnect();
  const { roomId } = params;
  const data = await req.json();

  const room = await Room.findOne({ roomId });

  if (!room) {
    return new Response(
      JSON.stringify({ error: "Room not found" }),
      { status: 404 }
    );
  }

  room.messages.push(data);
  await room.save();

  return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
}

export async function GET(req, { params }) {
  await dbConnect();
  const { roomId } = params;

  const room = await Room.findOne({ roomId });

  if (!room) {
    return new Response(
      JSON.stringify({ error: "Room not found" }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({ messages: room.messages }),
    { status: 200 }
  );
}