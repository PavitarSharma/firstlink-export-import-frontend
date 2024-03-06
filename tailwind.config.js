/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF5252",
      },
      fontFamily: {
        montez: ["Montez", "cursive"],
        anata: ["Anta", "sans-serif"],
        "dancing-script": ["Dancing Script", "cursive"],
      },
    },
  },
  plugins: [],
};
