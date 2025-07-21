// models/Room.js

import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String, // ✅ Should be capital 'String'
      required: true,
      trim: true,
    },
    createdBy: {
       required: true,
      type: String, // ✅ Use String, not ObjectId — works for Google ID or DB ID
      required: true,
    },
    members: [
      {
        type: String, // ✅ Use String too, not ObjectId — same reason
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    roomId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);