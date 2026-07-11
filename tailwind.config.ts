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
          DEFAULT: "#E03C31",
          dark: "#C22A20",
          light: "#FDECEA",
        },
      },
    },
  },
  plugins: [],
};

export default config;
