import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, enum: ["katha", "bhajan", "event", "misc"], default: "misc" },
    url: { type: String, required: true },
    thumbnail: String,
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
