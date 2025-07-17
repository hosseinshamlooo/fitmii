/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF', // 60% — Base
        primary: '#007AFF',    // 30% — Primary CTA
        accent: '#00C781',     // 10% — Success/Progress
        error: '#FF3B30',      // Error/Alert
        text: '#222222',       // Text Primary
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