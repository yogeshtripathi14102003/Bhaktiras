import mongoose from "mongoose";

const LiveStreamSchema = new mongoose.Schema(
  {
    templeName: { type: String, required: true },
    streamUrl: { type: String, required: true }, // HLS / YouTube live embed
    thumbnail: String,
    isLive: { type: Boolean, default: false },
    schedule: [
      {
        day: String, // e.g. "Monday"
        time: String, // e.g. "06:00 AM"
        title: String,
      },
    ],
    pastRecordings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Katha" }],
  },
  { timestamps: true }
);

export default mongoose.models.LiveStream || mongoose.model("LiveStream", LiveStreamSchema);
