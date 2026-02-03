/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#0ff022',
        'background-light': 'var(--background-light)',
        'background-dark': 'var(--background-dark)',
        'card-light': 'var(--card-light)',
        'card-dark': 'var(--card-dark)',
        'text-light': 'var(--text-light)',
        'text-dark': 'var(--text-dark)',
        'text-secondary-light': 'var(--text-secondary-light)',
        'text-secondary-dark': 'var(--text-secondary-dark)',
        'border-light': 'var(--border-light)',
        'border-dark': 'var(--border-dark)',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px'
      },
    },
  },
  plugins: [],
}
