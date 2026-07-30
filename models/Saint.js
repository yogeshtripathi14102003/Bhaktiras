import mongoose from "mongoose";

const SaintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    photo: String,
    era: String, // e.g. "16th century"
    biography: String,
    quotes: [String],
    teachings: [String],
    timeline: [
      {
        year: String,
        event: String,
      },
    ],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Katha" }],
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

SaintSchema.index({ name: "text", biography: "text" });

export default mongoose.models.Saint || mongoose.model("Saint", SaintSchema);
