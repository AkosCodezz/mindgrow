import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Themeable colors via CSS variables.
        // We map all shades to the same CSS var so existing classes like `primary-600`
        // update globally when the theme changes.
        primary: Object.fromEntries(
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((k) => [
            k,
            'rgb(var(--cr-primary) / <alpha-value>)',
          ])
        ) as any,
        secondary: Object.fromEntries(
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((k) => [
            k,
            'rgb(var(--cr-secondary) / <alpha-value>)',
          ])
        ) as any,
        accent: Object.fromEntries(
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((k) => [
            k,
            'rgb(var(--cr-accent) / <alpha-value>)',
          ])
        ) as any,
        neutral: {
          50: '#F5F3F0',
          100: '#E8E5E1',
          200: '#D1CBC3',
          300: '#BAB1A5',
          400: '#A39787',
          500: '#8C7D69',
          600: '#706454',
          700: '#544B3F',
          800: '#38322A',
          900: '#2C2C2C',
        },
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
