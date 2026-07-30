import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["bhajan", "katha", "blog"],
      required: true,
    },
    description: String,
  },
  { timestamps: true }
);

CategorySchema.index({ type: 1, slug: 1 });

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
