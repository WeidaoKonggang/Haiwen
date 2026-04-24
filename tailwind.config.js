/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        hq: {
          bg: '#0B0F19',
          panel: '#0F172A',
          panel2: '#0B1220',
          border: 'rgba(148, 163, 184, 0.14)',
          text: '#E5E7EB',
          muted: '#94A3B8',
          brand: '#4F46E5',
          brand2: '#0EA5E9',
          success: '#10B981',
          warn: '#F59E0B',
          danger: '#EF4444',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};

