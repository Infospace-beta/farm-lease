/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#13ec80', // Bright green - FarmLease primary color
        'primary-dark': '#047857', // Emerald green for high-tech premium feel
        'sidebar-bg': '#0f392b', // Deep forest green
        'forest-green': '#0f392b', // Deep forest green (alias)
        accent: '#d97706', // Earthy tone for alerts
        earth: '#5D4037', // Earthy brown for typography
        'earth-light': '#8D6E63',
        'background-light': '#f8fafc',
        'background-dark': '#0f172a',
        'surface-light': '#ffffff',
        'surface-dark': '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
      },
    },
  },
  plugins: [],
};
