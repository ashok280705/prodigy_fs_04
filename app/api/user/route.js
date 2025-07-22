import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

// ✅ GET profile
export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });
  } catch (error) {
    console.error("[Profile GET Error]:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ POST update profile + password
export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, phone, password } = await req.json();

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();

    if (password && password.trim().length >= 6) {
      const hashed = await bcrypt.hash(password.trim(), 10);
      user.password = hashed;
    }

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("[Profile POST Error]:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}