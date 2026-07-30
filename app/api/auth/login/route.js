import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { ok, fail } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return fail("Invalid input", 422, parsed.error.flatten());

    const { email, password } = parsed.data;
    await connectDB();

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) return fail("Invalid email or password", 401);

    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword) return fail("Invalid email or password", 401);

    if (user.status === "suspended") return fail("This account has been suspended", 403);

    const token = signToken({ id: user._id, role: user.role, name: user.name });
    setAuthCookie(token);

    return ok({ id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
  } catch (err) {
    return fail("Login failed", 500, err.message);
  }
}
