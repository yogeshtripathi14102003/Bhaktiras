import { Cormorant_Garamond, Mukta, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Mukta({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kishoribhakti.org";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kishori Bhakti — Katha, Bhajan, Live Darshan & Braj Culture",
    template: "%s | Kishori Bhakti",
  },
  description:
    "Watch Katha, listen to Bhajans, join Live Darshan from Braj temples, read spiritual blogs and daily quotes, and explore the saints and culture of Vrindavan.",
  keywords: [
    "Kishori Bhakti", "Radha Krishna", "Bhajan", "Katha", "Live Darshan",
    "Braj Culture", "Vrindavan", "Barsana", "Spiritual Blog", "Daily Quote",
  ],
  openGraph: {
    type: "website",
    siteName: "Kishori Bhakti",
    title: "Kishori Bhakti — Katha, Bhajan, Live Darshan & Braj Culture",
    description:
      "A devotional home for Katha, Bhajan, Live Darshan, Saints, Festivals and the culture of Braj.",
    url: SITE_URL,
    images: ["/images/og-cover.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kishori Bhakti",
    description: "Katha, Bhajan, Live Darshan & Braj Culture, in one devotional home.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kishori Bhakti",
    url: SITE_URL,
    description:
      "Devotional platform for Katha, Bhajan, Live Darshan, Spiritual Blogs and Braj Culture.",
    sameAs: [],
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
