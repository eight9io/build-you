/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF7B1C',
        // secondary: '#f4f5f7',
        // success: PALETTE.green[400],
        // warning: PALETTE.yellow[400],
        // danger: PALETTE.red[300],
        // neutral: PALETTE.neutral,
      },
    },
  },
  plugins: [],
};
