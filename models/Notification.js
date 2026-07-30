import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null = broadcast
    title: { type: String, required: true },
    message: String,
    type: { type: String, enum: ["info", "event", "festival", "live", "donation"], default: "info" },
    link: String,
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
