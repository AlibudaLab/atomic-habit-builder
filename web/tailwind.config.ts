import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

import { nextui } from '@nextui-org/theme';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
<<<<<<< HEAD
    './node_modules/@nextui-org/theme/dist/components/snippet.js',
    './node_modules/@nextui-org/theme/dist/components/select.js',
=======
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
>>>>>>> 0b7fbc2 (chore: create challenge flow)
  ],
  theme: {
    container: {
      center: true,
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-2': 'linear-gradient(270deg, #f55925 0%, #D75986 100%)',
      },
      gridTemplateColumns: {
        // Coffee column grid
        '2CoffeeLg': '1fr 380px',
        '2CoffeeMd': '1fr 330px',

        // Mint colum grid
        '2mint': '420px 1fr',
      },
      colors: {
        'boat-color-gray-900': '#191918',
        'boat-color-yellow-70': '#FFD200',
        'boat-gold': '#7b602f',
        primary: '#ff784f',
      },
      fontFamily: {
        nunito: ['var(--font-nunito)'],
        londrina: ['var(--font-londrina)'],
      },
    },
  },
  plugins: [nextui()],
};

export default config;
