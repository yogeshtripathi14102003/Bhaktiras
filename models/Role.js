import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g. "editor", "moderator"
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
    description: String,
  },
  { timestamps: true }
);

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
