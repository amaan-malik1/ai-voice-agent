/** @type {import('tailwindcss').Config} */
const colorVar = (name) => `rgb(var(${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: colorVar('--color-canvas'),
        surface: colorVar('--color-surface'),
        card: colorVar('--color-card'),
        border: colorVar('--color-border'),
        'border-bright': colorVar('--color-border-bright'),
        violet: { DEFAULT: colorVar('--color-violet'), light: colorVar('--color-violet-light') },
        amber: { DEFAULT: colorVar('--color-amber'), light: colorVar('--color-amber-light') },
        teal: { DEFAULT: colorVar('--color-teal') },
        muted: colorVar('--color-muted'),
        subtle: colorVar('--color-subtle'),
        primary: colorVar('--color-primary'),
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-violet': 'linear-gradient(135deg, #7B5CF5, #22D3EE)',
        'gradient-warm': 'linear-gradient(135deg, #7B5CF5, #F5A623)',
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'float-a': 'floatA 5s ease-in-out infinite',
        'float-b': 'floatB 6s ease-in-out infinite',
        'ripple-1': 'ripple 4s ease-out infinite 0s',
        'ripple-2': 'ripple 4s ease-out infinite 1s',
        'ripple-3': 'ripple 4s ease-out infinite 2s',
        'ripple-4': 'ripple 4s ease-out infinite 3s',
        marquee: 'marquee 22s linear infinite',
        blink: 'blink 1s ease-in-out infinite',
        'scroll-drop': 'scrollDrop 2.2s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: { '0%,100%': { opacity: '0.9' }, '50%': { opacity: '1' } },
        floatA: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        floatB: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(10px)' } },
        ripple: { '0%': { opacity: '0.5', transform: 'scale(1)' }, '100%': { opacity: '0', transform: 'scale(1.25)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.3' } },
        scrollDrop: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top', opacity: '1' },
          '50%': { transform: 'scaleY(1)', transformOrigin: 'top', opacity: '1' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom', opacity: '0' },
        },
      },
      boxShadow: {
        'glow-violet': 'var(--shadow-glow-violet)',
        'glow-amber': 'var(--shadow-glow-amber)',
        card: 'var(--shadow-card)',
      },
    },
  },
  plugins: [],
}
