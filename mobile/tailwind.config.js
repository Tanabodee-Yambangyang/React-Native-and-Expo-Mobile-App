/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {        
        charcoal: "#1C1C1C",       // Very dark gray (Eerie Black)
        fog: "#DADDD8",            // Soft gray-green (Timberwolf)
        sand: "#ECEBE4",           // Light warm beige (Alabaster)
        mist: "#EEF0F2",           // Cool light gray (Cultured)
        snow: "#FAFAFF",           // Near white (Ghost White)
      },
    },
  },
  plugins: [],
}

