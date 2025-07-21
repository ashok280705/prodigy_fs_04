// /api/room/[roomId]/messages/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";  // ✅ Correct import
import { authOptions } from "@/app/api/auth/[...nextauth]/route";  // ✅ Make sure this path is correct

// ✅ GET all messages for a room
export async function GET(_req, { params }) {
  const { roomId } =  await params;

  await dbConnect();

  const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

  return new Response(JSON.stringify({ messages }), { status: 200 });
}

// ✅ POST a new message for a room
export async function POST(req, { params }) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = params;
  const { text } = await req.json();

  if (!text || !roomId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // ✅ Use string ID for sender.id
  const newMessage = await Message.create({
    text,
    sender: {
      id: session.user.id.toString(), // ✅ always store as string
      name: session.user.name,
    },
    roomId: roomId,
  });

  return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
}

// ✅ DELETE (permanent or soft-delete) a message by _id + roomId
export async function DELETE(req, { params }) {
  const { roomId } = params;
  const { messageId, mode } = await req.json();

  await dbConnect();

  if (!messageId) {
    return new Response(JSON.stringify({ error: "Message ID is required" }), { status: 400 });
  }

  if (mode === "everyone") {
    // Permanent delete
    const result = await Message.deleteOne({ _id: messageId, roomId });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Message not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  if (mode === "me") {
    // For "delete for me" — you’d handle this on client or with a UserMessages map
    return new Response(JSON.stringify({
      note: "Delete for me handled client-side in your app"
    }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Invalid delete mode" }), { status: 400 });
}