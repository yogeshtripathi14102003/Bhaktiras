// import Link from "next/link";
// import { Flame, PlayCircle } from "lucide-react";

// export default function HeroBanner() {
//   return (
//     <section className="relative overflow-hidden bg-indigo">
//       <div className="absolute inset-0 bg-diya-glow" />
//       <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(135deg,transparent_48%,white_49%,white_51%,transparent_52%)] [background-size:38px_38px]" />

//       <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
//         <div className="animate-rise">
//           <p className="section-eyebrow flex items-center gap-2 text-marigold">
//             <Flame className="h-4 w-4 animate-flicker" /> Live from Braj, every morning
//           </p>
//           <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-ivory sm:text-6xl">
//             Radha Rani&apos;s grace,
//             <br />
//             carried to your home.
//           </h1>
//           <p className="mt-6 max-w-lg font-body text-base text-ivory/75 sm:text-lg">
//             Watch Katha, listen to Bhajans, join Live Darshan from the temples of
//             Barsana and Vrindavan, and walk the everyday path of Braj bhakti —
//             all in one devotional home.
//           </p>
//           <div className="mt-8 flex flex-wrap gap-4">
//             <Link
//               href="/live-darshan"
//               className="inline-flex items-center gap-2 rounded-full bg-marigold px-7 py-3 font-body text-sm font-semibold text-indigo transition hover:bg-marigold-light"
//             >
//               <PlayCircle className="h-4 w-4" /> Watch Live Darshan
//             </Link>
//             <Link
//               href="/kathas"
//               className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-7 py-3 font-body text-sm font-semibold text-ivory transition hover:border-marigold hover:text-marigold"
//             >
//               Explore Katha Library
//             </Link>
//           </div>
//         </div>

//         <div className="relative mx-auto aspect-[4/5] w-full max-w-sm animate-rise [animation-delay:150ms]">
//           <div className="absolute inset-0 rounded-arch bg-gradient-to-b from-marigold/25 via-peacock/20 to-transparent blur-2xl" />
//           <div className="relative flex h-full flex-col justify-end overflow-hidden rounded-arch border border-marigold/30 bg-gradient-to-b from-peacock-dark to-indigo p-8">
//             <Flame className="mb-4 h-10 w-10 text-marigold animate-flicker" strokeWidth={1.5} />
//             <p className="font-display text-2xl text-ivory">Today&apos;s Darshan</p>
//             <p className="mt-1 font-body text-sm text-ivory/70">Shri Radha Rani Temple, Barsana</p>
//           </div>
//         </div>
//       </div>
//       <div className="arch-divider" />
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import { Flame, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const DARSHAN_SLIDES = [
  {
    image: "/images/yk.png",
    title: "Today's Darshan",
    subtitle: "Shri Radha Rani Temple, Barsana",
  },
  {
    image: "/images/yk1.jpg",
    title: "Radha Rani Darshan",
    subtitle: "Barsana Dham",
  },
  {
    image: "/images/yk2.jpg",
    title: "Morning Darshan",
    subtitle: "Shri Banke Bihari Ji, Vrindavan",
  },
  {
    image: "/images/yk3.jpg",
    title: "Sandhya Darshan",
    subtitle: "Vrindavan Dham",
  },
];

const SLIDE_INTERVAL_MS = 4000;

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = DARSHAN_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slideCount - 1 ? 0 : prev + 1));
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  }, [slideCount]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Auto-advance, paused on hover/focus and skipped if there's nothing to cycle
  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;

    const interval = setInterval(nextSlide, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [nextSlide, slideCount, isPaused]);

  if (slideCount === 0) return null;

  const slide = DARSHAN_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-indigo">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-diya-glow" />

      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(135deg,transparent_48%,white_49%,white_51%,transparent_52%)] [background-size:38px_38px]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        {/* =========================================================
            LEFT CONTENT
        ========================================================= */}
        <div className="animate-rise">
          <p className="section-eyebrow flex items-center gap-2 text-marigold">
            <Flame className="h-4 w-4 animate-flicker" />
            Live from Braj, every morning
          </p>

          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
            Radha Rani&apos;s grace,
            <br />
            carried to your home.
          </h1>

          <p className="mt-6 max-w-lg font-body text-base text-ivory/75 sm:text-lg">
            Watch Katha, listen to Bhajans, join Live Darshan from the temples
            of Barsana and Vrindavan, and walk the everyday path of Braj bhakti
            — all in one devotional home.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/live-darshan"
              className="inline-flex items-center gap-2 rounded-full bg-marigold px-7 py-3 font-body text-sm font-semibold text-indigo transition hover:bg-marigold-light"
            >
              <PlayCircle className="h-4 w-4" />
              Watch Live Darshan
            </Link>

            <Link
              href="/kathas"
              className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-7 py-3 font-body text-sm font-semibold text-ivory transition hover:border-marigold hover:text-marigold"
            >
              Explore Katha Library
            </Link>
          </div>
        </div>

        {/* =========================================================
            RIGHT IMAGE SLIDER
        ========================================================= */}
        <div
          className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg animate-rise [animation-delay:150ms]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-marigold/25 via-peacock/20 to-transparent blur-2xl" />

          {/* Slider Card */}
          <div
            className="relative overflow-hidden rounded-2xl border border-marigold/30 bg-black shadow-2xl"
            role="region"
            aria-roledescription="carousel"
            aria-label="Darshan slideshow"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] w-full sm:aspect-[4/5]">
              <Image
                key={slide.image}
                src={slide.image}
                alt={slide.title}
                fill
                priority={currentSlide === 0}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 35vw"
                className="object-cover"
              />

              {/* Image Overlay (kept light so the image stays clearly visible) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>

            {/* =====================================================
                TEXT OVER IMAGE
            ===================================================== */}
            <div
              className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 md:p-8"
              aria-live="polite"
            >
              <p className="font-display text-xl text-white sm:text-2xl md:text-3xl">
                {slide.title}
              </p>

              <p className="mt-2 text-sm text-white/80 sm:text-base">
                {slide.subtitle}
              </p>
            </div>

            {/* =====================================================
                PREVIOUS BUTTON
            ===================================================== */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Darshan"
              className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-marigold hover:text-indigo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* =====================================================
                NEXT BUTTON
            ===================================================== */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Darshan"
              className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-marigold hover:text-indigo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* =====================================================
                SLIDER DOTS
            ===================================================== */}
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {DARSHAN_SLIDES.map((s, index) => (
                <button
                  key={s.image}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={currentSlide === index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-7 bg-marigold"
                      : "w-2 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* =====================================================
              SLIDE COUNTER
          ===================================================== */}
          <div className="absolute -right-3 top-5 z-30 rounded-full border border-marigold/30 bg-indigo/80 px-3 py-1 text-xs font-semibold text-marigold backdrop-blur-md">
            {String(currentSlide + 1).padStart(2, "0")} /{" "}
            {String(slideCount).padStart(2, "0")}
          </div>
        </div>
      </div>
    </section>
  );
}