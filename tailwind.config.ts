import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B1220",
          900: "#131B2C",
          800: "#1E293E",
          700: "#2E3B54",
          600: "#48597A",
          500: "#6B7B9C",
          400: "#93A2C0",
          300: "#B9C4DC",
          200: "#DAE1F0",
          100: "#EBEFF9",
          50: "#F5F7FD",
        },
        accent: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#EBF1FF",
        },
        gold: {
          DEFAULT: "#B8923F",
          light: "#F3E9D2",
        },
        paper: "#F7F9FE",
        marble: {
          50: "#FBFCFF",
          100: "#F5F7FE",
          200: "#EEF1FC",
          300: "#E4E9FA",
          400: "#D3DBF5",
        },
        ghost: "#F9FAFF",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(30,41,62,0.06), 0 8px 24px -8px rgba(30,41,62,0.14)",
        pop: "0 16px 40px -10px rgba(15,30,60,0.28)",
        glass: "0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 30px -10px rgba(37,99,235,0.14)",
        "glass-lg": "0 4px 16px -4px rgba(37,99,235,0.22), 0 12px 40px -12px rgba(15,30,60,0.2)",
        header: "0 1px 0 rgba(255,255,255,0.7) inset, 0 8px 32px -12px rgba(37,99,235,0.18), 0 1px 2px rgba(15,30,60,0.06)",
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
