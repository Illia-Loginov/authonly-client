import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      green: {
        100: '#ABD9C6',
        200: '#8ECCB3',
        300: '#72C09F',
        400: '#56B38C',
        500: '#469B77',
        600: '#36785C',
        700: '#2C634C',
        800: '#204636',
        900: '#132A20'
      }
    },
    fontFamily: {
      sans: ['Atkinson Hyperlegible', 'sans-serif']
    },
    extend: {}
  },
  plugins: []
} satisfies Config;
