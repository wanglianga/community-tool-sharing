/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{svelte,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f1',
          100: '#d9ecdb',
          200: '#b5d9b9',
          300: '#85bf8c',
          400: '#57a060',
          500: '#2F5233',
          600: '#2a4a2e',
          700: '#233d27',
          800: '#1d3220',
          900: '#17291a'
        },
        amber: {
          50: '#FFF8ED',
          100: '#FFECDB',
          200: '#FFD4A6',
          300: '#FFB978',
          400: '#F59E0B',
          500: '#E87722',
          600: '#D1641A',
          700: '#B55118',
          800: '#903F14',
          900: '#6E2F0E'
        },
        status: {
          available: '#22C55E',
          borrowed: '#3B82F6',
          pending: '#F59E0B',
          repairing: '#EF4444',
          scrapped: '#6B7280'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
