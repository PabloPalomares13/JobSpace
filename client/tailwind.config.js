/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        bannerImg: "url('./src/assets/julia-joppien-oFpjqLKWAs8-unsplash.jpg')",
        blackOverLay: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)"
      }
    },
  },
  plugins: [],
}

