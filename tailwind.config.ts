import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2e9e5b",
          dark: "#217a45",
          light: "#eaf6ee",
        },
      },
    },
  },
  plugins: [],
};

export default config;
