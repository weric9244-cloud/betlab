/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0f172a',
          darker: '#0a0f1a',
          light: '#1e293b',
        },
        accent: {
          green: '#10b981',
          yellow: '#fbbf24',
        },
      },
    },
  },
  plugins: [],
}

