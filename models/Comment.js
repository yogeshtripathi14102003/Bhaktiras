import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    onModel: { type: String, enum: ["Blog", "Katha"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "onModel" },
    text: { type: String, required: true },
    status: { type: String, enum: ["visible", "hidden", "flagged"], default: "visible" },
  },
  { timestamps: true }
);

CommentSchema.index({ onModel: 1, targetId: 1 });

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
