import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: { type: String, required: true },
    ctaText: String,
    ctaLink: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
