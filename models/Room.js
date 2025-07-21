// models/Room.js

import mongoose from "mongoose";


const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    roomId: {
      unique: true,
      type: String,
      required: true,
     }
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);