import DonationForm from "@/components/home/DonationForm";
import { HeartHandshake } from "lucide-react";

export const metadata = {
  title: "Donate",
  description: "Support temple seva, katha production and community events across Braj with a one-time or monthly donation.",
};

export default function DonatePage() {
  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <HeartHandshake className="mx-auto h-9 w-9 text-marigold" strokeWidth={1.5} />
          <h1 className="mt-4 font-display text-4xl font-semibold text-ivory sm:text-5xl">Support Seva in Braj</h1>
          <p className="mt-3 font-body text-sm text-ivory/70 sm:text-base">
            Every donation helps fund temple seva, katha production and community events.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
        <DonationForm />
      </div>
    </div>
  );
}
