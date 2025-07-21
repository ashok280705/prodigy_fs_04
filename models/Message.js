// models/Message.js
import mongoose, { Schema, models } from "mongoose";

const MessageSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    sender: {
      id: {
        type: String, // ✅ allow both ObjectId and Google ID as string
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    roomId: {
      ref: "Room",
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.Message || mongoose.model("Message", MessageSchema);