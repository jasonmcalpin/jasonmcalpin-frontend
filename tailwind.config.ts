import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: {
    files: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'],
  },
  safelist: [
    // Backgrounds
    'bg-background',
    'bg-background-light',
    'bg-background-dark',
    'bg-primary',
    'bg-primary-light',
    'bg-primary-dark',
    'bg-secondary',
    'bg-secondary-light',
    'bg-secondary-dark',
    'bg-neon-blue',
    'bg-neon-purple',

    // Text
    'text-white',
    'text-gray-300',
    'text-neon-blue',
    'text-neon-purple',
    'text-neon-white',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'text-6xl',

    // Borders
    'border-neon-blue',
    'border-neon-purple',
  ],
  theme: {
    extend: {
      spacing: {
        '999': '999px'
      },
      colors: {
        background: {
          light: '#1E1E1E',
          DEFAULT: '#121212',
          dark: '#0A0A0A',
        },
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
        neon: {
          blue: '#00F0FF',
          purple: '#9D00FF',
          white: '#FFFFFF',
          text: '#FFFFFF',
        },
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, var(--color-background), var(--color-background-light))',
        'hero-code': "url('/assets/images/code.jpg')",
        'hero-design': "url('/assets/images/design.jpg')",
        'hero-mobile': "url('/assets/images/mobile.jpg')",
        'hero-web': "url('/assets/images/web.jpg')",
      },
      boxShadow: {
        'secondary': '0 0 0 var(--color-secondary), 0 0 0 var(--color-secondary)',
        'neon-blue': '0 0 5px var(--color-neon-blue), 0 0 10px var(--color-neon-blue)',
        'neon-purple': '0 0 5px var(--color-neon-purple), 0 0 10px var(--color-neon-purple)',
      },
    },
  },
  plugins: [
    typography,
    function ({ addUtilities, theme }) {
      addUtilities({
        '.text-shadow-neon-blue': {
          textShadow: `0 0 5px ${theme('colors.neon.blue')}, 0 0 10px ${theme('colors.neon.blue')}`,
        },
        '.text-shadow-neon-purple': {
          textShadow: `0 0 5px ${theme('colors.neon.purple')}, 0 0 10px ${theme('colors.neon.purple')}`,
        },
      });
    },
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--color-primary-light': theme('colors.primary.light'),
          '--color-primary': theme('colors.primary.DEFAULT'),
          '--color-primary-dark': theme('colors.primary.dark'),
          '--color-secondary-light': theme('colors.secondary.light'),
          '--color-secondary': theme('colors.secondary.DEFAULT'),
          '--color-secondary-dark': theme('colors.secondary.dark'),
          '--color-background-light': theme('colors.background.light'),
          '--color-background': theme('colors.background.DEFAULT'),
          '--color-background-dark': theme('colors.background.dark'),
          '--color-neon-blue': theme('colors.neon.blue'),
          '--color-neon-purple': theme('colors.neon.purple'),
          '--color-neon-white': theme('colors.neon.white'),
          '--color-neon-text': theme('colors.neon.text'),
        },
      });
    },
  ],
};

export default config;