import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#fffdf9",
          100: "#f8f1e8",
          200: "#ead6c1"
        },
        copper: {
          200: "#eab892",
          300: "#d79b6a",
          400: "#c57c3d",
          500: "#a35222",
          700: "#7b3516",
          800: "#5d2611",
          900: "#41170c"
        },
        workshop: {
          900: "#0f172a",
          700: "#1e293b",
          300: "#cbd5e1",
          100: "#f1f5f9"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
