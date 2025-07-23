import mongoose from "mongoose";

const privateRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true,
      required: true,
    },
    participants: [
      {
        type: String, // store user IDs or emails (string)
        required: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PrivateRoom || mongoose.model("PrivateRoom", privateRoomSchema);