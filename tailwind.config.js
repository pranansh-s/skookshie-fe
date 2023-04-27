/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend:
    {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'varela': ['Varela Round', 'sans-serif']
      },
      colors: {
        'primary': '#a7ff83',
        'secondary': '#086972',
        'shadow': '#3b5441'
      },
      dropShadow: {
        'sm': '0 3px 3px rgba(59, 84, 65, 0.4)',
        '3xl': '0 13px 3px rgba(59, 84, 65, 0.4)',
      },
      animation: {
        'title': '1s ease-in-out 0.4s 1 forwards title',
      },
      keyframes: {
        title: {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        }
      }
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
