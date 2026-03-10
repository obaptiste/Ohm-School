import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
