import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0b0b0d",
          raised: "#131316",
          surface: "#19191d",
          elevated: "#212126"
        },
        border: {
          DEFAULT: "#2a2a30",
          subtle: "#1e1e23"
        },
        ink: {
          DEFAULT: "#f2f2f5",
          muted: "#9a9aa3",
          /* #84848c against bg #0b0b0d ≈ 5.3:1 contrast — passes WCAG AA for normal text (was 3.7:1). */
          faint: "#84848c"
        },
        accent: {
          DEFAULT: "#d7ff3f",
          foreground: "#0b0b0d",
          muted: "#8fae2b"
        },
        danger: {
          DEFAULT: "#ff5a4e",
          foreground: "#1a0a08"
        },
        success: {
          DEFAULT: "#35d07f",
          foreground: "#052015"
        },
        warning: {
          DEFAULT: "#ffb020",
          foreground: "#241300"
        },
        info: {
          DEFAULT: "#5aa9ff",
          foreground: "#051526"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"]
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.375rem"
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(215,255,63,0.4), 0 0 24px -4px rgba(215,255,63,0.35)"
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.6" },
          "70%": { transform: "scale(1.15)", opacity: "0" },
          "100%": { transform: "scale(1.15)", opacity: "0" }
        }
      },
      animation: {
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.2,0.6,0.4,1) infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
