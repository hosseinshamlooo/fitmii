/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0e1423', // 60% — Base
        primary: '#a8e8df',    // 30% — Primary CTA
        accent: '#17e1c5',     // 10% — Success/Progress
        error: '#FF3B30',      // Error/Alert
        text: '#6ea49d',       // Text Primary
      },
      fontFamily: {
        outfit: ["Outfit-Regular", "sans-serif"],
        "outfit-bold": ["Outfit-Bold", "sans-serif"],
        "outfit-extrabold": ["Outfit-ExtraBold", "sans-serif"],
        "outfit-light": ["Outfit-Light", "sans-serif"],
        "outfit-medium": ["Outfit-Medium", "sans-serif"],
        "outfit-regular": ["Outfit-Regular", "sans-serif"],
        "outfit-semibold": ["Outfit-SemiBold", "sans-serif"]
      },
    },
  },
  plugins: [],
}