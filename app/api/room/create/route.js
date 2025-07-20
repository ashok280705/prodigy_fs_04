import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import { nanoid } from "nanoid";

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, roomId } = await req.json();

  if (!name || name.trim() === "") {
    return NextResponse.json(
      { error: "Room name is required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email: session.user.email });

  const newRoom = new Room({
    roomId: roomId?.trim() || nanoid(8), // ✅ fallback unique ID
    name: name.trim(),
    createdBy: user._id,
    members: [user._id],
  });

  await newRoom.save();
  user.createdRooms.push(newRoom._id);
  user.joinedRooms.push(newRoom._id);
  await user.save();

  return NextResponse.json({ message: "Room created", room: newRoom });
}
