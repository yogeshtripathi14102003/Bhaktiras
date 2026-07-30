import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "bhajans.manage"
    label: String,
    module: String, // e.g. "Bhajans"
  },
  { timestamps: true }
);

export default mongoose.models.Permission || mongoose.model("Permission", PermissionSchema);
