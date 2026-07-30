import mongoose from "mongoose";

const FestivalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: Date, required: true }, // this year's occurrence
    banner: String,
    history: String,
    importance: String,
    mantra: String,
    relatedBhajans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bhajan" }],
    relatedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    reminderEnabled: { type: Boolean, default: true },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Festival || mongoose.model("Festival", FestivalSchema);
