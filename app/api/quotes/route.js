import { connectDB } from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { ok, fail, created } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const session = getSession();
    const filter = session?.role === "admin" ? {} : { isActive: true };
    const quotes = await Quote.find(filter).sort({ createdAt: -1 });
    return ok(quotes);
  } catch (err) {
    return fail("Could not load quotes", 500, err.message);
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    if (!body.text) return fail("Quote text is required", 422);

    const quote = await Quote.create(body);
    return created(quote);
  } catch (err) {
    return fail("Could not create quote", 500, err.message);
  }
}
