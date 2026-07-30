import { v2 as cloudinary } from "cloudinary";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Handles image/video uploads from the admin CMS (banners, thumbnails,
// gallery items, blog cover images, saint photos, etc).
export async function POST(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) return fail("No file provided", 422);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "kishori-bhakti",
      resource_type: "auto",
    });

    return ok({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    return fail("Upload failed", 500, err.message);
  }
}
