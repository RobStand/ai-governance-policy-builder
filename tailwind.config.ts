import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Engineered / technical-authoritative system (see DESIGN.md).
        // True-gray neutrals + a single sparingly-used emerald accent.
        ink: "#111317",
        paper: "#F6F6F7",
        line: {
          DEFAULT: "#E5E5E7",
          strong: "#D4D4D6",
        },
        muted: {
          DEFAULT: "#6B6B70",
          soft: "#9A9AA0",
        },
        accent: {
          DEFAULT: "#047857",
          dark: "#065F46",
          wash: "#ECFDF5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
