import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      green: {
        100: '#DFE5DC',
        200: '#C9D3C5',
        300: '#A9B8A3',
        400: '#889D80',
        500: '#64785C',
        600: '#4D5C47',
        700: '#303A2C',
        800: '#131712'
      }
    },
    fontFamily: {
      sans: ['Atkinson Hyperlegible', 'sans-serif']
    },
    extend: {}
  },
  plugins: []
} satisfies Config;
