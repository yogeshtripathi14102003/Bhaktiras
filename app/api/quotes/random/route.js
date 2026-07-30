import { connectDB } from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { ok, fail } from "@/lib/utils";

// Returns today's scheduled quote if one exists, otherwise a random
// active quote. Powers the homepage "Daily Quote" section.
export async function GET() {
  try {
    await connectDB();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let quote = await Quote.findOne({
      isActive: true,
      scheduledFor: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!quote) {
      const count = await Quote.countDocuments({ isActive: true });
      if (count === 0) return ok(null);
      const random = Math.floor(Math.random() * count);
      quote = await Quote.findOne({ isActive: true }).skip(random);
    }

    return ok(quote);
  } catch (err) {
    return fail("Could not load today's quote", 500, err.message);
  }
}
