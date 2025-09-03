import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: {
    files: [
      './index.html', 
      './src/**/*.{js,ts,jsx,tsx,css}'
    ],
  },
  theme: {
    extend: {
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
      textShadow: {
        'neon-blue': '0 0 5px var(--color-neon-blue), 0 0 10px var(--color-neon-blue)',
        'neon-purple': '0 0 5px var(--color-neon-purple), 0 0 10px var(--color-neon-purple)',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [
    typography,
    function ({ addUtilities, theme }) {
      addUtilities({
        '.text-shadow-neon-blue': {
          textShadow: `0 0 5px var(--color-neon-blue), 0 0 10px var(--color-neon-blue)`,
        },
        '.text-shadow-neon-purple': {
          textShadow: `0 0 5px var(--color-neon-purple), 0 0 10px var(--color-neon-purple)`,
        },
      });
    },
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }
  ],
};

export default config;