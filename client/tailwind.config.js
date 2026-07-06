/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        overlay: 'rgba(0, 0, 0, 0.5)',
        charcoal: {
          50: 'rgb(var(--color-charcoal-50) / <alpha-value>)',
          100: 'rgb(var(--color-charcoal-100) / <alpha-value>)',
          200: 'rgb(var(--color-charcoal-200) / <alpha-value>)',
          300: 'rgb(var(--color-charcoal-300) / <alpha-value>)',
          400: 'rgb(var(--color-charcoal-400) / <alpha-value>)',
          500: 'rgb(var(--color-charcoal-500) / <alpha-value>)',
          600: 'rgb(var(--color-charcoal-600) / <alpha-value>)',
          700: 'rgb(var(--color-charcoal-700) / <alpha-value>)',
          800: 'rgb(var(--color-charcoal-800) / <alpha-value>)',
          900: 'rgb(var(--color-charcoal-900) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-charcoal-800) / <alpha-value>)',
        },
        ivory: {
          50: 'rgb(var(--color-ivory-50) / <alpha-value>)',
          100: 'rgb(var(--color-ivory-100) / <alpha-value>)',
          200: 'rgb(var(--color-ivory-200) / <alpha-value>)',
          300: 'rgb(var(--color-ivory-300) / <alpha-value>)',
          400: 'rgb(var(--color-ivory-400) / <alpha-value>)',
          500: 'rgb(var(--color-ivory-500) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-ivory-100) / <alpha-value>)',
        },
        burgundy: {
          50: '#fdf3f5',
          100: '#f8e4e8',
          200: '#f2cdd6',
          300: '#e8a6b5',
          400: '#d9738b',
          500: '#c94d6a',
          600: '#b33355',
          700: '#962645',
          800: '#7e223c',
          900: '#5a1a2b',
          DEFAULT: '#7e223c',
        },
        rose: {
          light: '#f5e6e8',
          DEFAULT: '#d4a5b5',
          dark: '#b8889e',
        },
        gold: {
          light: '#f3e8c9',
          DEFAULT: '#c9a84c',
          dark: '#a8852e',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        elegant: ['Cormorant Garamond', 'Georgia', 'serif'],
        script: ['Great Vibes', 'cursive'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'hero': ['clamp(2.5rem, 8vw, 6rem)', { lineHeight: '1.1' }],
        'display': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.15' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
