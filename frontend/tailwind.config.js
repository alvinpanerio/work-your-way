/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      dropShadow: {
        xl: "0 20px 13px rgba(59, 130, 246, 0.2)",
      },
    },
  },
  plugins: [],
};
//
