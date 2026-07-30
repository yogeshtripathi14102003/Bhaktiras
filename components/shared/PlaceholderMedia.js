import {
  Music2, PlayCircle, Flame, BookOpen, CalendarHeart, Ticket, ImageIcon, Radio,
} from "lucide-react";

const ICONS = {
  bhajan: Music2,
  katha: PlayCircle,
  saint: Flame,
  blog: BookOpen,
  festival: CalendarHeart,
  event: Ticket,
  gallery: ImageIcon,
  live: Radio,
};

const GRADIENTS = [
  "from-peacock via-peacock-dark to-indigo",
  "from-marigold via-marigold-dark to-maroon",
  "from-maroon via-maroon-dark to-indigo",
  "from-indigo via-indigo-light to-peacock-dark",
];

/**
 * Stand-in for real media thumbnails in this demo (no external image
 * fetching in this environment). Swap for a real <Image src={item.thumbnail}>
 * once media is uploaded via /api/upload (Cloudinary).
 */
export default function PlaceholderMedia({ seed = "0", type = "bhajan", className = "", iconClassName = "" }) {
  const Icon = ICONS[type] || Music2;
  const gradient = GRADIENTS[Math.abs(hash(seed)) % GRADIENTS.length];

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:14px_14px]" />
      <Icon className={`relative text-ivory/90 ${iconClassName || "h-8 w-8"}`} strokeWidth={1.5} />
    </div>
  );
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return h;
}
