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
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    roomId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Message || mongoose.model("Message", MessageSchema);