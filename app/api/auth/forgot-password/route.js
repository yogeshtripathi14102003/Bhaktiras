import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { ok, fail } from "@/lib/utils";

// Sends a 6-digit OTP to the user's email for password reset.
// Wire up `sendOtpEmail` to your SMTP/nodemailer transport (see .env.example).
export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return fail("Email is required", 422);

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return fail("No account found with this email", 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // TODO: send OTP via nodemailer transport using SMTP_* env vars
    // await sendOtpEmail(user.email, otp);

    return ok({ message: "OTP sent to your email" });
  } catch (err) {
    return fail("Could not process request", 500, err.message);
  }
}
