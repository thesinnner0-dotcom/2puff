/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        puff: {
          bg: '#0A0A0F',
          card: '#111827',
          border: '#1F2937',
          muted: '#6B7280',
          purple: '#7C3AED',
          'purple-light': '#A855F7',
          pink: '#EC4899',
          tg: '#229ED9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
