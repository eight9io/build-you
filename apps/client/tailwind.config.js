/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          default: '#FF7B1C',
          light: '#FF9C54',
          dark: '#DE6914',
          50: 'rgba(255, 123, 28, 0.5)',
          20: 'rgba(255, 123, 28, 0.2)',
          10: 'rgba(255, 123, 28, 0.1)',
        },
        secondary: {
          default: '#FFDB7D',
          light: '#FFE7A8',
          dark: '#FFC632',
          50: 'rgba(255, 219, 125, 0.5)',
          20: 'rgba(255, 219, 125, 0.2)',
          10: 'rgba(255, 219, 125, 0.1)',
        },
        purple: {
          default: '#BE8AFF',
          light: '#C99EFF',
          dark: '#A96BF7',
          50: 'rgba(190, 138, 255, 0.5)',
          20: 'rgba(190, 138, 255, 0.2)',
          10: 'rgba(190, 138, 255, 0.1)',
        },
        black: {
          default: '#24252B',
          light: '#34363F',
        },
        gray: {
          dark: '#6C6E76',
          medium: '#C5C8D2',
          light: '#E7E9F1',
          veryLight: '#FAFBFF',
        },
        success: {
          default: '#20D231',
          20: 'rgba(32, 210, 49, 0.2)',
          10: 'rgba(32, 210, 49, 0.1)',
        },
        alert: {
          default: '#FFC120',
          20: 'rgba(255, 193, 32, 0.2)',
          10: 'rgba(255, 193, 32, 0.1)',
        },
        danger: {
          default: '#FF4949',
          20: 'rgba(255, 73, 73, 0.2)',
          10: 'rgba(255, 73, 73, 0.1)',
        },
        basic: {
          black: '#000000',
          white: '#FFFFFF',
          transparent: 'rgba(255, 255, 255, 0.005)',
        },
      },
    },
  },
  plugins: [],
};
