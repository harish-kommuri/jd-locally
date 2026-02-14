/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0076d7",
          accent: "#fe4200"
        }
      }
    }
  },
  plugins: []
};
