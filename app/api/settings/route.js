import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

async function getOrCreateSettings() {
  let settings = await Settings.findOne({ key: "site" });
  if (!settings) settings = await Settings.create({ key: "site" });
  return settings;
}

// Public: only the fields the storefront actually needs (no internal-only data yet, but keep it explicit).
export async function GET() {
  try {
    await connectDB();
    const settings = await getOrCreateSettings();
    return ok(settings);
  } catch (err) {
    return fail("Could not load settings", 500, err.message);
  }
}

export async function PUT(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const settings = await Settings.findOneAndUpdate({ key: "site" }, body, { new: true, upsert: true });
    return ok(settings);
  } catch (err) {
    return fail("Could not update settings", 500, err.message);
  }
}
