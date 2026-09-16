/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0F1A22',
          900: '#152430',
          800: '#1D3040',
          700: '#294357',
          600: '#3A5A73',
        },
        paper: {
          100: '#F4F5F2',
          200: '#ECEEE9',
          300: '#E1E4DC',
        },
        signal: {
          DEFAULT: '#2451C4',
          light: '#5C7FDB',
          dim: '#DCE4F7',
        },
        moss: {
          DEFAULT: '#2E6B4F',
          light: '#DCEBE2',
        },
        amber: {
          DEFAULT: '#C1780E',
          light: '#F5E6CC',
        },
        rust: {
          DEFAULT: '#A93F32',
          light: '#F3DEDA',
        },
        slate: {
          DEFAULT: '#6B6F76',
          light: '#E7E7E4',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
