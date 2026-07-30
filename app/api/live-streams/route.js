import { connectDB } from "@/lib/mongodb";
import LiveStream from "@/models/LiveStream";
import { ok, fail, created } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const streams = await LiveStream.find().populate("pastRecordings", "title slug thumbnail");
    return ok(streams);
  } catch (err) {
    return fail("Could not load live streams", 500, err.message);
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    if (!body.templeName || !body.streamUrl) return fail("Temple name and stream URL are required", 422);

    const stream = await LiveStream.create(body);
    return created(stream);
  } catch (err) {
    return fail("Could not create live stream", 500, err.message);
  }
}
