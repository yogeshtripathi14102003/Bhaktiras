import mongoose from "mongoose";

const BhajanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    singer: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    lyrics: { type: String }, // rich text / plain text
    lyricsPdfUrl: String,
    audioUrl: String,
    videoUrl: String,
    thumbnail: String,
    duration: Number, // seconds
    playCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

BhajanSchema.index({ title: "text", lyrics: "text", singer: "text" });

export default mongoose.models.Bhajan || mongoose.model("Bhajan", BhajanSchema);
