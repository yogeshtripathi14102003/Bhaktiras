/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF6EC",
        indigo: {
          DEFAULT: "#16233F",
          light: "#233A63",
        },
        peacock: {
          DEFAULT: "#0F6E6E",
          light: "#12908F",
          dark: "#0A4F4F",
        },
        marigold: {
          DEFAULT: "#E8A93B",
          light: "#F3C468",
          dark: "#C4841E",
        },
        maroon: {
          DEFAULT: "#7A1F2B",
          light: "#9C2B39",
          dark: "#59151E",
        },
        sandal: "#8B5E34",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        arch: "999px 999px 12px 12px",
      },
      backgroundImage: {
        "diya-glow": "radial-gradient(circle at 50% 30%, rgba(232,169,59,0.35), transparent 60%)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: 1, transform: "scaleY(1)" },
          "50%": { opacity: 0.85, transform: "scaleY(0.95)" },
        },
        rise: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        flicker: "flicker 2.4s ease-in-out infinite",
        rise: "rise 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
