import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    donorName: String,
    donorEmail: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    frequency: { type: String, enum: ["one-time", "monthly"], default: "one-time" },
    method: { type: String, enum: ["upi", "card", "netbanking"], required: true },
    purpose: { type: String, default: "General" },
    status: { type: String, enum: ["pending", "success", "failed", "refunded"], default: "pending" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    receiptUrl: String,
    receiptNumber: String,
  },
  { timestamps: true }
);

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);
