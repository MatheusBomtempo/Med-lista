/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    container: {
      center: true,
    },extend: {
      colors: {
        'fundo': '#F9FFFF',
        'fundo1': '#F3F8FB',
        'verde': '#014A49',
        'verdeClaro': '#DDF1EF',
        'verdeClaro1': '#C4E4E1',
      }
    }
  },
  plugins: [],
}