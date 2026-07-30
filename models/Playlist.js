import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    bhajans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bhajan" }],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Playlist || mongoose.model("Playlist", PlaylistSchema);
