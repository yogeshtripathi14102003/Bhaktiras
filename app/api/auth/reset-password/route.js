import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { ok, fail } from "@/lib/utils";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();
    if (!email || !otp || !newPassword) return fail("Missing fields", 422);

    await connectDB();
    const user = await User.findOne({ email }).select("+otp +otpExpires");
    if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      return fail("Invalid or expired OTP", 400);
    }

    user.password = await hashPassword(newPassword);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return ok({ message: "Password reset successfully" });
  } catch (err) {
    return fail("Could not reset password", 500, err.message);
  }
}
