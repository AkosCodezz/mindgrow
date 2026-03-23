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
        primary: {
          50: '#f0f7ed',
          100: '#dcecd4',
          200: '#b9d9a9',
          300: '#92c379',
          400: '#6fb050',
          500: '#6B8E23',
          600: '#557320',
          700: '#44591a',
          800: '#364716',
          900: '#2D5016',
        },
        secondary: {
          50: '#e6f4fb',
          100: '#cce9f7',
          200: '#99d3ef',
          300: '#66bde7',
          400: '#4A90E2',
          500: '#0077BE',
          600: '#005f98',
          700: '#004872',
          800: '#00304c',
          900: '#001826',
        },
        accent: {
          50: '#fff4f1',
          100: '#ffe9e3',
          200: '#ffd3c7',
          300: '#ffbdab',
          400: '#FFB347',
          500: '#FF6B6B',
          600: '#e85555',
          700: '#cc3f3f',
          800: '#b02929',
          900: '#8f1313',
        },
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
        'gradient': 'gradient-shift 8s ease infinite',
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