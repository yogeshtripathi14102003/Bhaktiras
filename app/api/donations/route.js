import { connectDB } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { ok, fail, created, paginate } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";
import { sendEmail, donationThankYouEmail } from "@/lib/email";

// Donors pay via the UPI ID / QR shown on the Donate page (configured in
// Settings by the admin), then submit this form to record what they
// paid. UPI-via-QR is a direct bank transfer with no gateway callback,
// so we record it as "pending" and let the admin confirm it from the
// dashboard once the payment is verified.
export async function POST(req) {
  try {
    await connectDB();
    const session = getSession();
    const body = await req.json();
    const { amount, method, frequency, purpose, donorName, donorEmail, receiptNumber } = body;

    if (!amount || amount <= 0) return fail("A valid donation amount is required", 422);
    if (!method) return fail("Payment method is required", 422);

    const donation = await Donation.create({
      user: session?.id,
      donorName: donorName || "Anonymous",
      donorEmail,
      amount,
      method,
      frequency: frequency || "one-time",
      purpose: purpose || "General",
      receiptNumber,
      status: "pending",
    });

    if (donorEmail) {
      sendEmail({ to: donorEmail, ...donationThankYouEmail(donation) }).catch(() => {});
    }

    return created(donation);
  } catch (err) {
    return fail("Could not record donation", 500, err.message);
  }
}

// Admin: list all donations, or user: list own donation history via ?mine=1
export async function GET(req) {
  try {
    const session = getSession();
    if (!session) return fail("Not authenticated", 401);

    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = paginate(searchParams);
    const mine = searchParams.get("mine");

    const filter = {};
    if (mine) {
      filter.user = session.id;
    } else {
      const guard = requireRole(session, ["admin"]);
      if (!guard.ok) return fail(guard.message, guard.status);
    }

    const [items, total] = await Promise.all([
      Donation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Donation.countDocuments(filter),
    ]);

    return ok({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return fail("Could not load donations", 500, err.message);
  }
}
