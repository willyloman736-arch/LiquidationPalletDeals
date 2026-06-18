import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcdaff",
          300: "#8ec2ff",
          400: "#599fff",
          500: "#327aff",
          600: "#1f5cf2",
          700: "#1947d9",
          800: "#1a3cb0",
          900: "#1b388c",
          950: "#142457",
        },
        accent: {
          500: "#ff8a3c",
          600: "#f06a16",
          700: "#c9530d",
        },
        ink: {
          900: "#0b1220",
          800: "#1a2438",
          700: "#2c3754",
          600: "#4a5675",
          500: "#6b7693",
          400: "#9099b3",
          300: "#c2c8d8",
          200: "#e2e6ef",
          100: "#f1f3f9",
          50: "#f8f9fc",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,18,32,0.06), 0 8px 24px -8px rgba(11,18,32,0.12)",
        pop: "0 12px 40px -12px rgba(31,92,242,0.35)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in .4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
