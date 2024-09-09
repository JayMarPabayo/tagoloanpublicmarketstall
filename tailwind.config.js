/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "slow-spin": "spin 120s linear infinite",
      },
      gridTemplateColumns: {
        18: "repeat(18, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
