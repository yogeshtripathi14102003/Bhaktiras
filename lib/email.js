import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

const FROM = () => `"Kishori Bhakti" <${process.env.SMTP_USER || "no-reply@kishoribhakti.org"}>`;

/**
 * Sends an email if SMTP is configured; otherwise logs and no-ops.
 * Callers should never let a failed/skip send block the main
 * request (registration, booking, donation) — always fire-and-forget
 * or wrap in try/catch at the call site.
 */
export async function sendEmail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.log(`[email skipped — SMTP not configured] to=${to} subject="${subject}"`);
    return { sent: false };
  }
  try {
    await t.sendMail({ from: FROM(), to, subject, html });
    return { sent: true };
  } catch (err) {
    console.error("Email send failed:", err.message);
    return { sent: false, error: err.message };
  }
}

export function welcomeEmail(name) {
  return {
    subject: "Welcome to Kishori Bhakti 🙏",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#3730a3">Jai Shri Radhe, ${name}!</h2>
        <p>Your account on <strong>Kishori Bhakti</strong> has been created successfully.</p>
        <p>You can now save your favorite Bhajans and Saints, register for events, and track your donations from your dashboard.</p>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">— Team Kishori Bhakti</p>
      </div>
    `,
  };
}

export function kathaBookingEmail(booking) {
  return {
    subject: "Katha Booking Request Received",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#3730a3">Booking Request Received</h2>
        <p>Namaste ${booking.name},</p>
        <p>We've received your request for <strong>${booking.kathaType || "a Katha"}</strong> on
        <strong>${new Date(booking.preferredDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>.
        Our team will contact you shortly to confirm the details.</p>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">— Team Kishori Bhakti</p>
      </div>
    `,
  };
}

export function donationThankYouEmail(donation) {
  return {
    subject: "Thank You for Your Donation 🙏",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#3730a3">Jai Shri Radhe!</h2>
        <p>Thank you for your generous contribution of <strong>₹${donation.amount}</strong> towards seva in Braj.</p>
        <p>Your support helps fund temple seva, katha production and community events. Our team will confirm your donation shortly.</p>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">— Team Kishori Bhakti</p>
      </div>
    `,
  };
}
