"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

/** type: "bhajan" | "katha" | "saint" */
export default function FavoriteButton({ type, id, dark = false }) {
  const [favorited, setFavorited] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function checkStatus() {
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        const meJson = await meRes.json();
        if (!meJson.success) return;
        if (cancelled) return;
        setLoggedIn(true);

        const favRes = await fetch("/api/favorites", { cache: "no-store" });
        const favJson = await favRes.json();
        if (!cancelled && favJson.success) {
          const key = type === "bhajan" ? "bhajans" : type === "katha" ? "kathas" : "saints";
          const list = (favJson.data[key] || []).map((x) => x.toString());
          setFavorited(list.includes(id));
        }
      } catch {
        // stay logged-out state
      }
    }
    checkStatus();
    return () => {
      cancelled = true;
    };
  }, [type, id]);

  async function toggle() {
    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      const json = await res.json();
      if (json.success) setFavorited(json.data.favorited);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 font-body text-sm transition disabled:opacity-60 ${
        favorited
          ? dark
            ? "border-marigold bg-marigold/15 text-marigold"
            : "border-maroon bg-maroon/5 text-maroon"
          : dark
            ? "border-ivory/25 text-ivory/85 hover:border-marigold hover:text-marigold"
            : "border-indigo/15 text-indigo hover:border-marigold hover:text-marigold-dark"
      }`}
    >
      <Heart className={`h-4 w-4 ${favorited ? "fill-maroon" : ""}`} />
      {favorited ? "Favorited" : "Favorite"}
    </button>
  );
}
