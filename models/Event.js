import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    banner: String,
    venue: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    capacity: Number,
    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    gallery: [String],
    status: { type: String, enum: ["upcoming", "ongoing", "completed", "cancelled"], default: "upcoming" },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

const RegistrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    phone: String,
    qrCode: String, // encoded ticket string / data URL
    attended: { type: Boolean, default: false },
    checkedInAt: Date,
  },
  { timestamps: true }
);

export const EventRegistration =
  mongoose.models.EventRegistration || mongoose.model("EventRegistration", RegistrationSchema);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
