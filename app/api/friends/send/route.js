import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FriendRequest from "@/models/FriendRequest";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fromUser = await User.findOne({ email: session.user.email });
  const sent = await FriendRequest.find({ from: fromUser._id, status: "pending" }).populate("to", "name email");

  return NextResponse.json({ sent }, { status: 200 });
}