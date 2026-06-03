import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        primary: "var(--color-primary)",
        dark: "var(--color-dark)",
        "cat-kerja": "#3F72AF",
        "cat-pribadi": "#A78BFA",
        "cat-kesehatan": "#6EE7B7",
        "cat-belajar": "#FCD34D",
        "cat-lain": "#94A3B8",
        "priority-high": "#F87171",
        "priority-medium": "#FB923C",
        "priority-low": "#4ADE80",
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        badge: "999px",
        input: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
