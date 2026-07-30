import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "site" },
    siteName: { type: String, default: "Kishori Bhakti" },
    logo: String,
    favicon: String,
    contactEmail: String,
    contactPhone: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      youtube: String,
      twitter: String,
    },
    donation: {
      upiId: String, // e.g. "kishoribhakti@upi"
      upiPayeeName: { type: String, default: "Kishori Bhakti" },
      qrImageUrl: String, // optional custom QR image; auto-generated from upiId if blank
    },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
