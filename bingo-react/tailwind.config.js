/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          900: '#0a0e27',
          800: '#1a1f3a',
          700: '#2a1f4a',
          600: '#3a2f5a',
        },
        accent: {
          teal: '#39c2d7',
          purple: '#6366f1',
          blue: '#3b82f6',
        },
        tile: {
          light: '#fef3c7',
          dark: '#fde68a',
          text: '#1f2937',
        },
      },
      boxShadow: {
        glow: '0 0 0 2px rgba(57,194,215,0.6), 0 0 15px 2px rgba(57,194,215,0.4)',
        line: '0 0 10px 2px rgba(99,102,241,0.8)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
