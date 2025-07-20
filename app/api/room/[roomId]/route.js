// app/api/room/[roomId]/route.js
import dbConnect from "@/lib/db";
import Room from "@/models/Room";

export async function GET(req, { params }) {
  await dbConnect();

  const room = await Room.findOne({ roomId: params.roomId }).populate(
    "members",
    "name email"
  );

  if (!room) {
    return new Response(
      JSON.stringify({ error: "Room not found" }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      room: {
        roomId: room.roomId,
        name: room.name,
        members: room.members,
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}