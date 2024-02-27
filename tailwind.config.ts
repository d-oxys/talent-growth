import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/containers/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      container: {
        center: true,
      },
      screens: {
        xl: '1440px',
      },
      colors: {
        primary: '#D61F3B',
        background: '#F8F8FF',
        primaryColor: '#518581',
        secondaryColor: '#FFB23F',
        black: '#151411',
        textColor: '#AFADB5',
        'primary-1': '#2AA8FF',
        'primary-2': '#32B6C1',
        'primary-3': '#637381',
      },
    },
  },
};

export default config;
