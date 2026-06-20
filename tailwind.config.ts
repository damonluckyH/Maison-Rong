import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C41E3A',
          gold: '#D4A843',
          'gold-light': '#F0D68A',
          black: '#1A1A1A',
          'black-light': '#2A2A2A',
          jade: '#2E8B57',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spinSlow 800ms ease-out forwards',
        'draw-line': 'drawLine 600ms ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '0.6', boxShadow: '0 0 8px rgba(212,168,67,0.3)' },
          '50%': { opacity: '1', boxShadow: '0 0 20px rgba(212,168,67,0.8)' },
        },
        spinSlow: {
          '0%': { opacity: '0', transform: 'rotate(-90deg) scale(0.8)' },
          '100%': { opacity: '1', transform: 'rotate(0deg) scale(1)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
