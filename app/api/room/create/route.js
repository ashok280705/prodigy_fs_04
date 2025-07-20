import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, roomId } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Room name is required." },
      { status: 400 }
    );
  }

  if (!roomId?.trim()) {
    return NextResponse.json(
      { error: "Room ID is required." },
      { status: 400 }
    );
  }

  const cleanRoomId = roomId.trim();

  // ✅ Check if roomId already exists BEFORE trying to insert
  const existing = await Room.findOne({ roomId: cleanRoomId });
  if (existing) {
    return NextResponse.json(
      { error: "Room ID already exists. Please choose another one." },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  }

  const newRoom = new Room({
    roomId: cleanRoomId,
    name: name.trim(),
    createdBy: user._id,
    members: [user._id],
  });

  try {
    await newRoom.save();

    user.createdRooms.push(newRoom._id);
    user.joinedRooms.push(newRoom._id);
    await user.save();

    return NextResponse.json({
      message: "Room created successfully.",
      room: {
        _id: newRoom._id,
        name: newRoom.name,
        roomId: newRoom.roomId, // ✅ return the correct `roomId` for client redirect
      },
    });
  } catch (error) {
    console.error("[Create Room Error]:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}