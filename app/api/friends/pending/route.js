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

  const toUser = await User.findOne({ email: session.user.email });
  const pending = await FriendRequest.find({ to: toUser._id, status: "pending" }).populate("from", "name email");

  return NextResponse.json({ pending }, { status: 200 });
}