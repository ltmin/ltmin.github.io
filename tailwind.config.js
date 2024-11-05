/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        blinkingCopy: {
          "0%, 100%": {
            color: "#6cc070",
          },
        },
      },
      animation: {
        blinkingCopy: "blinkingCopy 0.2s ease-in-out",
      },
    },
  },
  plugins: [],
  safelist: [],
};
