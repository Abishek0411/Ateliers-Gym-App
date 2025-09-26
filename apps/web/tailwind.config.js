/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          darkRed: '#B71C1C',
          navy: '#0B2545',
          darkYellow: '#F6C85F',
          black: '#000000',
          accentWhite: '#F7F7F9',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
        display: ['Impact', 'Arial Black', 'sans-serif'],
      },
      animation: {
        confetti: 'confetti 0.6s ease-out',
        morph: 'morph 0.3s ease-in-out',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': {
            transform: 'translateY(-100px) rotate(360deg)',
            opacity: '0',
          },
        },
        morph: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(246, 200, 95, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(246, 200, 95, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
