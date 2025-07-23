import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PrivateRoom from "@/models/PrivateRoom";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { toEmail } = await req.json();

  const fromUser = await User.findOne({ email: session.user.email });
  const toUser = await User.findOne({ email: toEmail });

  if (!toUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // ✅ Always generate the SAME ID by sorting
  const ids = [fromUser._id.toString(), toUser._id.toString()].sort();
  const roomId = `private-${ids[0]}-${ids[1]}`;

  // ✅ Check if it exists already
  let room = await PrivateRoom.findOne({ roomId });

  if (!room) {
    room = new PrivateRoom({
      members: [fromUser.email, toUser.email],
      roomId,
    });
    await room.save();
  }

  return NextResponse.json({ roomId: room.roomId });
}