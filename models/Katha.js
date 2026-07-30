import mongoose from "mongoose";

const KathaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    speaker: {
      name: String,
      bio: String,
      photo: String,
    },
    videoUrl: { type: String, required: true },
    thumbnail: String,
    duration: Number,
    views: { type: Number, default: 0 },
    relatedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Katha" }],
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

KathaSchema.index({ title: "text", description: "text", "speaker.name": "text" });

export default mongoose.models.Katha || mongoose.model("Katha", KathaSchema);
