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
        // Deep navy — primary brand
        brand: {
          50: "#f2f5fb",
          100: "#e3e9f4",
          200: "#c4d2e7",
          300: "#97aed2",
          400: "#6485b6",
          500: "#3f6099",
          600: "#2c477a",
          700: "#213a63",
          800: "#14264f",
          900: "#0e2148",
          950: "#081532",
        },
        // Refined gold — accent
        accent: {
          50: "#fbf6e6",
          100: "#f5e9c2",
          200: "#ecd488",
          300: "#e0c04e",
          400: "#d3ad36",
          500: "#c9a227",
          600: "#a8821e",
          700: "#856617",
          800: "#6b5215",
          900: "#5a4516",
        },
        // Warm neutral — text & surfaces
        ink: {
          900: "#1a1814",
          800: "#28251f",
          700: "#403d36",
          600: "#565249",
          500: "#78756e",
          400: "#a3a09a",
          300: "#cbc9c3",
          200: "#e4e3df",
          100: "#f1f0ee",
          50: "#f8f8f7",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,38,79,0.06), 0 10px 30px -12px rgba(20,38,79,0.14)",
        pop: "0 14px 44px -14px rgba(20,38,79,0.30)",
        gold: "0 10px 30px -12px rgba(201,162,39,0.45)",
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
