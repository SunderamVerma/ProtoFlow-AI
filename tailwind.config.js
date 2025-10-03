/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        spin: 'spin 1s linear infinite',
        rise: 'rise 8s infinite ease-in',
      },
      keyframes: {
        rise: {
          '0%': {
            bottom: '-100px',
            transform: 'translateX(0)',
          },
          '100%': {
            bottom: '1080px',
            transform: 'translateX(200px)',
          },
        },
      },
    },
  },
  plugins: [],
}