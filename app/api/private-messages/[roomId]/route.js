import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PrivateMessage from "@/models/PrivateMessage";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roomId } = await params;
  const { text } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Message text required" }, { status: 400 });
  }

  const message = new PrivateMessage({
    text,
    sender: { id: session.user.id, name: session.user.name },
    roomId,
  });

  await message.save();

  return NextResponse.json({ message }, { status: 201 });
}

export async function GET(req, { params }) {
  await dbConnect();
  const { roomId } = params;

  const messages = await PrivateMessage.find({ roomId }).sort({ createdAt: 1 });
  return NextResponse.json({ messages }, { status: 200 });
}