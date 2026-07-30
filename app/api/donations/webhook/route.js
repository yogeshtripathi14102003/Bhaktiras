import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { ok, fail } from "@/lib/utils";

// Razorpay webhook: verifies signature, marks donation success/failed,
// and generates a receipt number. Configure this URL in the Razorpay
// dashboard and set RAZORPAY_KEY_SECRET as the webhook secret.
export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expected) return fail("Invalid webhook signature", 400);

    const payload = JSON.parse(rawBody);
    const { order_id, id: paymentId } = payload.payload.payment.entity;

    await connectDB();
    const donation = await Donation.findOne({ razorpayOrderId: order_id });
    if (!donation) return fail("Donation not found for this order", 404);

    donation.status = payload.event === "payment.captured" ? "success" : "failed";
    donation.razorpayPaymentId = paymentId;
    if (donation.status === "success") {
      donation.receiptNumber = `KB-RCPT-${Date.now()}`;
    }
    await donation.save();

    return ok({ received: true });
  } catch (err) {
    return fail("Webhook processing failed", 500, err.message);
  }
}
