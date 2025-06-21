/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,ts,tsx,jsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      width: {
        15: "60px", // 카테고리 아이콘 크기
        50: "200px", // 큰 카드 너비
      },
      height: {
        15: "60px", // 카테고리 아이콘 크기
        30: "120px", // 일반 카드 높이
        40: "160px", // 큰 카드 높이
      },
    },
  },
  plugins: [],
};
