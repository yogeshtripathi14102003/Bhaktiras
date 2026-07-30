import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: String, default: "" },
    scheduledFor: Date, // for auto-scheduling as "today's quote"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);
