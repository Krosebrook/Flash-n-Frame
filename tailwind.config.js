/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['Roboto Condensed', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        int: {
          primary: 'rgb(var(--int-primary) / <alpha-value>)',
          accent: 'rgb(var(--int-accent) / <alpha-value>)',
          'bg-dark': 'rgb(var(--int-bg-dark) / <alpha-value>)',
          surface: 'rgb(var(--int-surface) / <alpha-value>)',
          'glow-purple': 'rgb(var(--int-glow-purple) / <alpha-value>)',
          'glow-pink': 'rgb(var(--int-glow-pink) / <alpha-value>)',
          'glow-coral': 'rgb(var(--int-glow-coral) / <alpha-value>)',
          success: 'rgb(var(--int-success) / <alpha-value>)',
          warning: 'rgb(var(--int-warning) / <alpha-value>)',
          error: 'rgb(var(--int-error) / <alpha-value>)',
          info: 'rgb(var(--int-info) / <alpha-value>)',
        },
        slate: {
          950: 'rgb(var(--c-bg-950) / <alpha-value>)',
          900: 'rgb(var(--c-bg-900) / <alpha-value>)',
          800: 'rgb(var(--c-bg-800) / <alpha-value>)',
          700: 'rgb(var(--c-text-700) / <alpha-value>)',
          600: 'rgb(var(--c-text-600) / <alpha-value>)',
          500: 'rgb(var(--c-text-500) / <alpha-value>)',
          400: 'rgb(var(--c-text-400) / <alpha-value>)',
          300: 'rgb(var(--c-text-300) / <alpha-value>)',
          200: 'rgb(var(--c-text-200) / <alpha-value>)',
          100: 'rgb(var(--c-text-100) / <alpha-value>)',
        },
        white: 'rgb(var(--c-white) / <alpha-value>)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        'liquid-dark': 'radial-gradient(circle at 50% 0%, rgba(30, 41, 59, 0.5) 0%, rgba(15, 20, 30, 1) 80%)',
        'int-gradient': 'linear-gradient(135deg, #2B6C85 0%, #33475B 100%)',
        'int-hero': 'radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
        'glass-purple': 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
      },
      boxShadow: {
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'glass-sm': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
        'neon-violet': '0 0 20px -5px rgba(139, 92, 246, 0.5)',
        'neon-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.5)',
        'neon-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.5)',
        'neon-pink': '0 0 20px -5px rgba(236, 72, 153, 0.5)',
        'neon-teal': '0 0 30px -5px rgba(43, 108, 133, 0.6)',
        'glow-purple': '0 0 60px rgba(139, 92, 246, 0.4), 0 0 120px rgba(139, 92, 246, 0.2)',
        'glow-pink': '0 0 60px rgba(236, 72, 153, 0.4), 0 0 120px rgba(236, 72, 153, 0.2)',
      },
      borderRadius: {
        'int': '3px',
      },
    }
  },
  plugins: [],
}
