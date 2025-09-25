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
        },
      },
    },
  },
  plugins: [],
};
