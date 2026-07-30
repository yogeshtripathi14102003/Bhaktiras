import { connectDB } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const donation = await Donation.findByIdAndUpdate(params.id, body, { new: true });
    if (!donation) return fail("Donation not found", 404);
    return ok(donation);
  } catch (err) {
    return fail("Could not update donation", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const donation = await Donation.findByIdAndDelete(params.id);
    if (!donation) return fail("Donation not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete donation", 500, err.message);
  }
}
