import mongoose from "mongoose";

const QuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "in-progress", "resolved"], default: "new" },
    adminNote: String,
  },
  { timestamps: true }
);

export default mongoose.models.Query || mongoose.model("Query", QuerySchema);
