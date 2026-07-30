import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { ok, fail } from "@/lib/utils";
import { sendEmail, welcomeEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return fail("Invalid input", 422, parsed.error.flatten());
    }
    const { name, email, password, phone } = parsed.data;

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) return fail("An account with this email already exists", 409);

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, phone, password: hashed });

    sendEmail({ to: user.email, ...welcomeEmail(user.name) }).catch(() => {});

    const token = signToken({ id: user._id, role: user.role, name: user.name });
    setAuthCookie(token);

    return ok({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    return fail("Registration failed", 500, err.message);
  }
}
