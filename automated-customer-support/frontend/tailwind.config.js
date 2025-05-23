/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 #A8DCAB77' },
          '50%': { boxShadow: '0 0 32px 12px #A8DCAB33' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
      },
    },
  },
};
