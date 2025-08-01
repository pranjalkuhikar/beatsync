/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
      },
      colors: {
        light: "#f8f9fa",
        "light-gray": "#e9ecef",
        gray: {
          100: "#dee2e6",
          200: "#ced4da",
          300: "#adb5bd",
          400: "#6c757d",
          500: "#495057",
          600: "#343a40",
        },
        dark: "#212529",
        primary: "#6366f1",
        "primary-light": "#818cf8",
        "primary-dark": "#4f46e5",
        secondary: "#ec4899",
        "secondary-light": "#f472b6",
        "secondary-dark": "#db2777",
        happy: "#fbbf24",
        sad: "#60a5fa",
        angry: "#ef4444",
        neutral: "#94a3b8",
        energetic: "#f97316",
        calm: "#10b981",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-in": "slide-in 0.6s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "rotate-3d": "rotate-3d 20s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translateY(0px) rotateY(0deg)",
          },
          "50%": {
            transform: "translateY(-10px) rotateY(5deg)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-500px 0",
          },
          "100%": {
            backgroundPosition: "500px 0",
          },
        },
        "slide-in": {
          "0%": {
            transform: "translateX(-100%) scale(0.8)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0) scale(1)",
            opacity: "1",
          },
        },
        "fade-in-up": {
          "0%": {
            transform: "translateY(30px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "rotate-3d": {
          "0%": {
            transform: "perspective(1000px) rotateY(0deg)",
          },
          "100%": {
            transform: "perspective(1000px) rotateY(360deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
