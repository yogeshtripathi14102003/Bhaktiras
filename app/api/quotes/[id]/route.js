import { connectDB } from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const quote = await Quote.findById(params.id);
    if (!quote) return fail("Quote not found", 404);
    return ok(quote);
  } catch (err) {
    return fail("Could not load quote", 500, err.message);
  }
}

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const quote = await Quote.findByIdAndUpdate(params.id, body, { new: true });
    if (!quote) return fail("Quote not found", 404);
    return ok(quote);
  } catch (err) {
    return fail("Could not update quote", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const quote = await Quote.findByIdAndDelete(params.id);
    if (!quote) return fail("Quote not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete quote", 500, err.message);
  }
}
