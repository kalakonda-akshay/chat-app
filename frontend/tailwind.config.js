/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 70px rgba(20, 184, 166, 0.18)"
      },
      animation: {
        floatIn: "floatIn 240ms ease-out",
        pulseSoft: "pulseSoft 1.4s ease-in-out infinite"
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: 0.45 },
          "50%": { opacity: 1 }
        }
      }
    }
  },
  plugins: []
};
