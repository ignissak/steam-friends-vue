/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,js,ts}', './index.html'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['black']
  }
}
