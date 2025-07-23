import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import FriendRequest from "@/models/FriendRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { toEmail } = await req.json();
  if (!toEmail) return NextResponse.json({ error: "To email required" }, { status: 400 });

  const fromUser = await User.findOne({ email: session.user.email });
  const toUser = await User.findOne({ email: toEmail });

  if (!toUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (fromUser._id.equals(toUser._id)) return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });

  const existing = await FriendRequest.findOne({ from: fromUser._id, to: toUser._id, status: "pending" });
  if (existing) return NextResponse.json({ error: "Already sent" }, { status: 400 });

  const newReq = new FriendRequest({ from: fromUser._id, to: toUser._id, status: "pending" });
  await newReq.save();

  return NextResponse.json({ success: true, message: "Request sent!" });
}