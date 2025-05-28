/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 #A8DCAB77' },
          '50%': { boxShadow: '0 0 32px 12px #A8DCAB33' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'float': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'float2': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'float3': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce-slow 2.5s infinite',
        'wiggle': 'wiggle 1.3s infinite',
        'float': 'float 2s ease-in-out infinite',
        'float2': 'float2 2.8s ease-in-out infinite',
        'float3': 'float3 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
