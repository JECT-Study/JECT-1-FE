/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,ts,tsx,jsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        main: "#6C4DFF",
        sub: "#DFD8FD",
        gray50: "#FAFAFA",
        gray100: "#F5F5F5",
        gray200: "#EEEEEE",
        gray300: "#E0E0E0",
        gray400: "#BDBDBD",
        gray500: "#9E9E9E",
        gray600: "#707070",
        gray700: "#424242",
        gray800: "#212121",
        black: "#111111",
      },
    },
  },
  plugins: [],
};
