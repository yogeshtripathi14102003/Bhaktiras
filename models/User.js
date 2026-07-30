import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, select: false }, // absent for OAuth-only users
    avatar: { type: String, default: "" },
    provider: { type: String, enum: ["credentials", "google"], default: "credentials" },
    googleId: { type: String },
    role: { type: String, enum: ["guest", "user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    favorites: {
      bhajans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bhajan" }],
      kathas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Katha" }],
      saints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Saint" }],
    },
    notificationPrefs: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
