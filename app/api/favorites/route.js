import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/auth";
import { ok, fail } from "@/lib/utils";

const FIELD_BY_TYPE = { bhajan: "favorites.bhajans", katha: "favorites.kathas", saint: "favorites.saints" };

export async function GET() {
  try {
    const session = getSession();
    if (!session) return fail("Not authenticated", 401);

    await connectDB();
    const user = await User.findById(session.id).select("favorites");
    return ok(user?.favorites || { bhajans: [], kathas: [], saints: [] });
  } catch (err) {
    return fail("Could not load favorites", 500, err.message);
  }
}

/** Body: { type: "bhajan" | "katha" | "saint", id: "<mongo id>" } — toggles it on/off. */
export async function POST(req) {
  try {
    const session = getSession();
    if (!session) return fail("Not authenticated", 401);

    const { type, id } = await req.json();
    const field = FIELD_BY_TYPE[type];
    if (!field || !id) return fail("Invalid favorite type or id", 422);

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return fail("Not authenticated", 401);

    const [group, key] = field.split(".");
    const list = user[group][key];
    const idx = list.findIndex((x) => x.toString() === id);
    const isFavorited = idx === -1;

    if (isFavorited) list.push(id);
    else list.splice(idx, 1);

    await user.save();
    return ok({ favorited: isFavorited });
  } catch (err) {
    return fail("Could not update favorite", 500, err.message);
  }
}
