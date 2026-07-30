import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    album: { type: String, default: "General" },
    type: { type: String, enum: ["photo", "video"], default: "photo" },
    url: { type: String, required: true },
    thumbnail: String,
    tags: [String],
    isTempleGallery: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
