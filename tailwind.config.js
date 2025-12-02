/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'coral': {
          500: '#FF6B6B',
          600: '#FF5252'
        },
        'emerald': {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          900: '#064E3B'
        }
      },
      animation: {
        'bounce': 'bounce 2s infinite',
        'pulse': 'pulse 3s infinite'
      }
    },
  },
  plugins: [],
};