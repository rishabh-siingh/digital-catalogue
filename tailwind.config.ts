import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0F1512",
          900: "#16201B",
          800: "#1F2C24",
          700: "#2C3B32",
          600: "#455448",
          500: "#647563",
          400: "#8A9B87",
          300: "#B4C2AE",
          200: "#D8E1D3",
          100: "#ECF1E8",
          50: "#F6F8F3",
        },
        accent: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#EFF4FF",
        },
        gold: {
          DEFAULT: "#B8923F",
          light: "#F3E9D2",
        },
        paper: "#FBFBFD",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(15,21,18,0.06), 0 8px 24px -8px rgba(15,21,18,0.12)",
        pop: "0 12px 32px -8px rgba(15,21,18,0.22)",
        glass: "0 1px 0 rgba(15,21,18,0.04), 0 8px 24px -12px rgba(15,21,18,0.16)",
        "glass-lg": "0 4px 16px -4px rgba(37,99,235,0.18), 0 12px 40px -12px rgba(15,21,18,0.18)",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
