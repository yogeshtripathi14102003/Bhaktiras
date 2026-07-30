import mongoose from "mongoose";

const SEOSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true }, // e.g. "home", "bhajans"
    metaTitle: String,
    metaDescription: String,
    ogImage: String,
    keywords: [String],
  },
  { timestamps: true }
);

export default mongoose.models.SEO || mongoose.model("SEO", SEOSchema);
