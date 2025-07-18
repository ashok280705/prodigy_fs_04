import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, phone } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email and password are required" }), { status: 400 });
    }

    await dbConnect();

    const trimmedEmail = email.trim().toLowerCase();
    const name = trimmedEmail.split("@")[0];

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: trimmedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : "",
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });

  } catch (error) {
    console.error("Register API error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}