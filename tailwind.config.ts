import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171711",
        ivory: "#F2EBDD",
        coffee: "#6D4933",
        gold: "#B79661",
        forest: "#283428",
        muted: "#C9C0B0",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
