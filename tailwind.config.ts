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
        navy: {
          DEFAULT: "#13263f",
          50: "#f3f6fb",
          100: "#e3eaf5",
          600: "#1f3a5f",
          700: "#13263f",
          800: "#0d1b2e",
          900: "#091322",
        },
        charcoal: "#1d2430",
        paper: "#f4f5f7",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
