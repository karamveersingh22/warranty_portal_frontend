/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Safrina brand — deep, trustworthy navy
        brand: {
          50:  '#eef2f8',
          100: '#d6e0ee',
          200: '#aec2da',
          300: '#7e9cc0',
          400: '#4f73a1',
          500: '#345785',
          600: '#274468',
          700: '#1d3557',
          800: '#182c49',
          900: '#13223a',
          950: '#0b1526',
        },
        // Safrina accent — warm reddish pink
        accent: {
          50:  '#fdeef3',
          100: '#fbd6e1',
          200: '#f7adc3',
          300: '#f180a1',
          400: '#e85680',
          500: '#d6336c',
          600: '#b81f57',
          700: '#971747',
          800: '#7a1239',
          900: '#5e0e2c',
        },
        surface: {
          50:  '#f3f6fb',
          100: '#eaeff7',
          200: '#dce3ee',
          300: '#c3cedd',
          400: '#94a1b8',
          500: '#677288',
          600: '#4a5468',
          700: '#343c4d',
          800: '#1f2533',
          900: '#131824',
          950: '#080b13',
        },
        success: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        // Clean, trustworthy sans throughout — no decorative display face
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 6px 24px rgba(19, 34, 58, 0.06)',
        'glass-lg': '0 16px 40px rgba(19, 34, 58, 0.10)',
        'card': '0 1px 2px rgba(19, 34, 58, 0.04), 0 2px 10px rgba(19, 34, 58, 0.05)',
        'glow': '0 0 0 1px rgba(29, 53, 87, 0.04)',
        'glow-lg': '0 8px 24px rgba(29, 53, 87, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
