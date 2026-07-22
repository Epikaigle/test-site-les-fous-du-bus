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
        violetLight: 'var(--violet-light)',
        magenta: 'var(--magenta)',
        cyan: 'var(--cyan)',
        cyanDim: 'var(--cyan-dim)',
        textMain: 'var(--text-main)',
        textSecondary: 'var(--text-secondary)',
        accentGold: 'var(--accent-gold)',
        alert: 'var(--alert)',
        borderColor: 'var(--border-color)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
      },
      boxShadow: {
        glowViolet: '0 0 20px var(--glow-violet)',
        glowCyan: '0 0 20px var(--glow-cyan)',
        card: '0 4px 24px rgba(0, 0, 0, 0.15)',
        cardHover: '0 8px 32px rgba(110, 59, 188, 0.2)'
      }
    }
  },
  plugins: [],
}
