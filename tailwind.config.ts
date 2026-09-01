import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          600: '#0265d2',
          700: '#034ea2',
          accent: '#10b981',
          gold: '#f59e0b',
          rose: '#f43f5e',
          cyan: '#06b6d4',
          darkBg: '#090d16',
          cardBg: '#111827',
          panelBg: '#1a2332',
          glassBorder: 'rgba(255, 255, 255, 0.08)',
        },
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-green': 'glowGreen 1.5s ease-in-out infinite alternate',
        'glow-red': 'glowRed 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glowGreen: {
          '0%': { boxShadow: '0 0 5px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)' },
        },
        glowRed: {
          '0%': { boxShadow: '0 0 5px rgba(244, 63, 94, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(244, 63, 94, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
