import { NextResponse } from "next/server";

/**
 * Lightweight redirect helper. In production, prefer wiring Google
 * sign-in through NextAuth (see app/api/auth/[...nextauth]/route.js
 * once you add it) which handles the OAuth handshake, token exchange,
 * and session cookie for you:
 *
 *   import GoogleProvider from "next-auth/providers/google";
 *   providers: [GoogleProvider({ clientId: ..., clientSecret: ... })]
 *
 * This stub exists so the route is present in the scaffold; swap it
 * for the NextAuth catch-all route when you wire up real OAuth.
 */
export async function GET() {
  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXTAUTH_URL}/api/auth/callback/google&response_type=code&scope=openid%20email%20profile`
  );
}
