/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bgMain: 'var(--bg-main)',
        bgSecondary: 'var(--bg-secondary)',
        surface: 'var(--surface)',
        violet: 'var(--violet)',
        magenta: 'var(--magenta)',
        cyan: 'var(--cyan)',
        textMain: 'var(--text-main)',
        textSecondary: 'var(--text-secondary)',
        accentGold: 'var(--accent-gold)',
        alert: 'var(--alert)',
        borderColor: 'var(--border-color)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '4px'
      }
    }
  },
  plugins: [],
}
