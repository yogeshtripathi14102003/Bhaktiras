import mongoose from "mongoose";

const KathaBookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional, if logged in
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    kathaType: { type: String, trim: true }, // e.g. "Shrimad Bhagwat Katha", "Ram Katha"
    preferredDate: { type: Date, required: true },
    venue: { type: String, trim: true },
    address: String,
    notes: String,
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    adminNote: String,
  },
  { timestamps: true }
);

export default mongoose.models.KathaBooking || mongoose.model("KathaBooking", KathaBookingSchema);
