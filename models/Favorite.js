import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    onModel: { type: String, enum: ["Bhajan", "Katha", "Saint"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "onModel" },
  },
  { timestamps: true }
);

FavoriteSchema.index({ user: 1, onModel: 1, targetId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);
