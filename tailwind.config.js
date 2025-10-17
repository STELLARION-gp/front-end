/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,scss}", // adjust for your project
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        secondary: "#1e293b",
        accent: {
          DEFAULT: "#38bdf8",
          light: "#7dd3fc",
          dark: "#0ea5e9",
        },
        text: {
          DEFAULT: "#e2e8f0",
          light: "#ffffff",
          dark: "#1a1a1a",
        },
        background: {
          light: "#f8fafc",
          dark: "#0f172a",
        },
        border: "#334155",
        theme1: "#040C24",
        theme2: "#0A205A",
        theme3: "#108CFF",
        theme4: "#9DA5BD",
        theme5: "#E6F9FF",
        // Galaxy color palette
        galaxy: {
          pink: "#FF61F6",
          purple: "#7B4BFF",
          cyan: "#00E5FF",
          aqua: "#5DF9FF",
          gold: "#FFD500",
          orange: "#FF7D00",
          hotPink: "#FF0070",
          electricBlue: "#01FEFE",
          green: "#01FF89",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        outfit: ["'Outfit'", "sans-serif"],
        orbitron: ["'Orbitron'", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      transitionTimingFunction: {
        fast: "ease-in-out",
        medium: "ease-in-out",
        slow: "ease-in-out",
      },
      transitionDuration: {
        fast: "200ms",
        medium: "300ms",
        slow: "500ms",
      },
      backgroundImage: {
        gradient1: "linear-gradient(90deg, #89F9E8 0%, #FACB7B 100%)",
        gradient2: "linear-gradient(90deg, #D87CEE 0%, #FACB7B 100%)",
        gradient3: "linear-gradient(90deg, #9099FC 0%, #89F9E8 100%)",
        gradient4: "linear-gradient(180deg, #9099FC 0%, #D87CEE 100%)",
        // Galaxy-themed gradients
        galaxyGradient1: "linear-gradient(90deg, #7B4BFF 0%, #FF61F6 100%)",
        galaxyGradient2: "linear-gradient(90deg, #00E5FF 0%, #01FEFE 100%)",
        galaxyGradient3: "linear-gradient(135deg, #FF0070 0%, #7B4BFF 50%, #00E5FF 100%)",
      },
    },
  },
  plugins: [],
};
