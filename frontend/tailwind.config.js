/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#ED0707',
          dark: '#130705',
          light: '#F2F3F6',
          slate: '#727586',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
