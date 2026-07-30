"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

const AMOUNTS = [101, 501, 1101, 2100];

export default function DonationForm() {
  const [settings, setSettings] = useState(null);
  const [amount, setAmount] = useState(501);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState("one-time");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => json.success && setSettings(json.data))
      .catch(() => {});
  }, []);

  const finalAmount = customAmount ? Number(customAmount) : amount;
  const upiId = settings?.donation?.upiId;
  const payeeName = settings?.donation?.upiPayeeName || "Kishori Bhakti";
  const upiLink = upiId
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${finalAmount}&cu=INR`
    : "";
  const qrSrc =
    settings?.donation?.qrImageUrl ||
    (upiLink ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}` : null);

  function copyUpiId() {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          method: "upi",
          frequency,
          purpose: "General",
          donorName: donorName || "Anonymous",
          donorEmail,
          receiptNumber,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message || "Could not record your donation");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-peacock/30 bg-peacock/5 p-8 text-center">
        <p className="font-display text-2xl font-semibold text-indigo">Jai Shri Radhe 🙏</p>
        <p className="mt-2 font-body text-sm text-indigo/65">
          Your {frequency} donation of ₹{finalAmount} has been recorded and is pending confirmation.
          {donorEmail && " A receipt has been emailed to you."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo/10 bg-white p-8">
      {/* UPI QR — admin-configured */}
      <div className="flex flex-col items-center rounded-xl border border-marigold/25 bg-marigold/5 p-5 text-center">
        {qrSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrSrc} alt="Scan to pay via UPI" className="h-40 w-40 rounded-lg bg-white p-1" />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed border-indigo/20 font-body text-xs text-indigo/40">
            UPI QR not configured yet
          </div>
        )}
        {upiId ? (
          <button type="button" onClick={copyUpiId} className="mt-3 flex items-center gap-1.5 font-mono text-sm text-indigo hover:text-marigold-dark">
            {upiId} {copied ? <Check className="h-3.5 w-3.5 text-peacock" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        ) : (
          <p className="mt-3 font-body text-xs text-indigo/50">Ask the temple office for the UPI ID.</p>
        )}
        <p className="mt-1 font-body text-[11px] text-indigo/50">Scan with any UPI app, then confirm below.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex rounded-full bg-indigo/5 p-1">
          {["one-time", "monthly"].map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFrequency(f)}
              className={`flex-1 rounded-full py-2 font-body text-sm capitalize transition ${
                frequency === f ? "bg-marigold text-indigo font-semibold" : "text-indigo/60"
              }`}
            >
              {f.replace("-", " ")}
            </button>
          ))}
        </div>

        <p className="mt-6 font-body text-xs text-indigo/60">Amount paid (INR)</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {AMOUNTS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => { setAmount(a); setCustomAmount(""); }}
              className={`rounded-lg border py-2 font-body text-sm transition ${
                amount === a && !customAmount ? "border-marigold bg-marigold/10 text-marigold-dark font-semibold" : "border-indigo/15 text-indigo/70"
              }`}
            >
              ₹{a}
            </button>
          ))}
        </div>
        <input
          type="number"
          min="1"
          placeholder="Custom amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="mt-3 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Your name (optional)"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
          />
          <input
            type="email"
            placeholder="Email (for receipt)"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            className="rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
          />
        </div>
        <input
          placeholder="UPI transaction ref / UTR (optional)"
          value={receiptNumber}
          onChange={(e) => setReceiptNumber(e.target.value)}
          className="mt-3 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
        />

        {error && <p className="mt-3 font-body text-xs text-maroon">{error}</p>}

        <button
          type="submit"
          disabled={status === "sending" || !finalAmount}
          className="mt-6 w-full rounded-full bg-marigold py-3 font-body text-sm font-semibold text-indigo transition hover:bg-marigold-light disabled:opacity-60"
        >
          {status === "sending" ? "Recording…" : `I've Paid ₹${finalAmount || 0} — Confirm`}
        </button>
      </form>
    </div>
  );
}
