import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { ok, fail, created, paginate } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = paginate(searchParams);
    const album = searchParams.get("album");
    const type = searchParams.get("type");
    const temple = searchParams.get("temple");

    const filter = {};
    if (album) filter.album = album;
    if (type) filter.type = type;
    if (temple) filter.isTempleGallery = true;

    const [items, total] = await Promise.all([
      Gallery.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Gallery.countDocuments(filter),
    ]);

    return ok({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return fail("Could not load gallery", 500, err.message);
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    if (!body.title || !body.url) return fail("Title and media URL are required", 422);

    const item = await Gallery.create(body);
    return created(item);
  } catch (err) {
    return fail("Could not add gallery item", 500, err.message);
  }
}
