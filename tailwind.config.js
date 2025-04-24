/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3D5A73',
          DEFAULT: '#2A3B4C',
          dark: '#1A2A3C',
        },
        secondary: {
          light: '#FF9E2A',
          DEFAULT: '#FF7E00',
          dark: '#E06E00',
        },
        background: {
          light: '#1E1E1E',
          DEFAULT: '#121212',
          dark: '#0A0A0A',
        },
        neon: {
          blue: '#00F0FF',
          purple: '#9D00FF',
        },
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
