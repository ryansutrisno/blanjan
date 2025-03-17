/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50',
          hover: '#45a049',
        },
        danger: {
          DEFAULT: '#ff4444',
          hover: '#cc0000',
        },
        info: {
          DEFAULT: '#2196F3',
          hover: '#0b7dda',
        }
      },
      maxHeight: {
        'screen-minus-header': 'calc(100vh - 320px)',
      }
    },
  },
  plugins: [],
}