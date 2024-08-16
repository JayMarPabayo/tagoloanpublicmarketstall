/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "slow-spin": "spin 120s linear infinite", // Adjust the duration as needed
      },
    },
  },
  plugins: [],
};
