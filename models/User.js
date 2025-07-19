
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
       required: false,
   
    },
    phone: {
      type: String,
      trim: true,
      sparse: (v) => (v ? v.replace(/\D/g, "") : ""), // Store only digits
      sparse: true, // Allow empty phone numbers
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
  }
);

// ✅ Avoid model overwrite error in dev
export default mongoose.models.User || mongoose.model("User", userSchema);