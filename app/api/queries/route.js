import { connectDB } from "@/lib/mongodb";
import Query from "@/models/Query";
import { ok, fail, created, paginate } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = paginate(searchParams);
    const status = searchParams.get("status");

    const filter = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Query.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Query.countDocuments(filter),
    ]);

    return ok({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return fail("Could not load queries", 500, err.message);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.email || !body.message) {
      return fail("Name, email and message are required", 422);
    }

    const query = await Query.create(body);
    return created(query);
  } catch (err) {
    return fail("Could not submit query", 500, err.message);
  }
}
