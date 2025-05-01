/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#D2D0F5",
        color1: "#C0B6FF",
        color2: "#F2E7F8",
        color3: "#F2E7F8B8",
        color4: "#7B70BF",
      },

      fontFamily: {
        spacemono: ["SpaceMono", "sans-serif"],
        abril: ["AbrilRegular", "sans-serif"],
        playfairregular: ["PlayfairRegular", "sans-serif"],
        playfairbold: ["PlayfairBold", "sans-serif"],
        playfairbolditalic: ["PlayfairBoldItalic", "sans-serif"],
        playfairextrabold: ["PlayfairExtraBold", "sans-serif"],
        playfairitalic: ["PlayfairItalic", "sans-serif"],
        playfairmedium: ["PlayfairMedium", "sans-serif"],
        playfairmediumitalic: ["PlayfairMediumItalic", "sans-serif"],
        playfairsemi: ["PlayfairSemiBold", "sans-serif"],
        playfairsemiitalic: ["PlayfairSemiBoldItalic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
