import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C83A0A',
          dark: '#9B3008',
          light: '#FF4F1F',
        },
        secondary: {
          DEFAULT: '#1C1917',
          dark: '#0C0A09',
          light: '#44403C',
        },
        pink: {
          DEFAULT: '#FFADC9',
          light: '#FFD6E5',
          dark: '#FF85AE',
        },
        festival: {
          warm: '#FFFBF7',
          dark: '#1C1917',
        },
      },
      fontFamily: {
        heading: ['var(--font-bricolage)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-luciole)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
    },
  },
  plugins: [],
}

export default config
