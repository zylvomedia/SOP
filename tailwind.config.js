/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F5F7',
        surface: '#FFFFFF',
        ink: {
          950: '#1D1D1F',
          800: '#3A3A3C',
          600: '#6E6E73',
          400: '#A1A1A6',
          200: '#D2D2D7',
          100: '#E8E8ED',
        },
        blue: {
          DEFAULT: '#0071E3',
          light: '#E8F1FD',
          dark: '#0058B0',
        },
        green: {
          DEFAULT: '#2FA84F',
          light: '#E7F7EC',
        },
        orange: {
          DEFAULT: '#FF9500',
          light: '#FFF3E0',
        },
        purple: {
          DEFAULT: '#AF52DE',
          light: '#F5E9FB',
        },
        red: {
          DEFAULT: '#FF3B30',
          light: '#FFEBEA',
        },
        gray: {
          DEFAULT: '#8E8E93',
          light: '#F0F0F2',
        },
        pink: {
          DEFAULT: '#FF375F',
          light: '#FFE8ED',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 1px 12px rgba(0,0,0,0.04)',
        pop: '0 8px 30px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
