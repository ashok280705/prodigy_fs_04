import mongoose from "mongoose";

const PrivateMessageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    sender: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    roomId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.PrivateMessage || mongoose.model("PrivateMessage", PrivateMessageSchema);