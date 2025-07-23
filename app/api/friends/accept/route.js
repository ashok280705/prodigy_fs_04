import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FriendRequest from "@/models/FriendRequest";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { requestId } = await req.json();
  const request = await FriendRequest.findById(requestId);
  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  request.status = "accepted";
  await request.save();

  await User.findByIdAndUpdate(request.from, { $addToSet: { friends: request.to } });
  await User.findByIdAndUpdate(request.to, { $addToSet: { friends: request.from } });

  return NextResponse.json({ success: true, message: "Friend added!" });
}