import { clearAuthCookie } from "@/lib/auth";
import { ok } from "@/lib/utils";

export async function POST() {
  clearAuthCookie();
  return ok({ loggedOut: true });
}
