import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // SEO friendly URL
    excerpt: String,
    content: { type: String, required: true }, // HTML / markdown
    coverImage: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [String],
    author: {
      name: String,
      photo: String,
    },
    readTime: Number, // minutes
    views: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    publishedAt: Date,
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
    },
  },
  { timestamps: true }
);

BlogSchema.index({ title: "text", content: "text", tags: "text" });

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
