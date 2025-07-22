// app/api/room/all/route.js
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const rooms = await Room.find().lean();

  return NextResponse.json({ rooms });
}