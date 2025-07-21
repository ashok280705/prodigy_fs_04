import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[SESSION]", session);

  const userId =  session.user._id || session.user.id; // Ensure we use the correct user ID format
  console.log("[USER ID USED]", userId);

  try {
   const myRooms = await Room.find({ createdBy: userId });
    console.log("[ROOMS FOUND]", myRooms);

    return NextResponse.json({ rooms: myRooms }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user rooms:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}