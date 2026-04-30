/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:  '#09090F',
        surface: '#111120',
        card:    '#16162A',
        border:  '#2A2A45',
        'border-bright': '#4A4A70',
        violet: { DEFAULT: '#7B5CF5', light: '#9D85F8' },
        amber:  { DEFAULT: '#F5A623', light: '#F8C060' },
        teal:   { DEFAULT: '#22D3EE' },
        muted:  '#6B6B90',
        subtle: '#9292B5',
        primary:'#E8E6FF',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        sans:    ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-violet': 'linear-gradient(135deg, #7B5CF5, #22D3EE)',
        'gradient-warm':   'linear-gradient(135deg, #7B5CF5, #F5A623)',
      },
      animation: {
        'spin-slow':   'spin 10s linear infinite',
        'pulse-soft':  'pulseSoft 3s ease-in-out infinite',
        'float-a':     'floatA 5s ease-in-out infinite',
        'float-b':     'floatB 6s ease-in-out infinite',
        'ripple-1':    'ripple 4s ease-out infinite 0s',
        'ripple-2':    'ripple 4s ease-out infinite 1s',
        'ripple-3':    'ripple 4s ease-out infinite 2s',
        'ripple-4':    'ripple 4s ease-out infinite 3s',
        'marquee':     'marquee 22s linear infinite',
        'blink':       'blink 1s ease-in-out infinite',
        'scroll-drop': 'scrollDrop 2.2s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft:  { '0%,100%': { opacity: '0.9' }, '50%': { opacity: '1' } },
        floatA:     { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        floatB:     { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(10px)' } },
        ripple:     { '0%': { opacity: '0.5', transform: 'scale(1)' }, '100%': { opacity: '0', transform: 'scale(1.25)' } },
        marquee:    { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        blink:      { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.3' } },
        scrollDrop: { '0%': { transform: 'scaleY(0)', transformOrigin: 'top', opacity: '1' }, '50%': { transform: 'scaleY(1)', transformOrigin: 'top', opacity: '1' }, '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom', opacity: '0' } },
      },
      boxShadow: {
        'glow-violet': '0 0 30px rgba(123,92,245,0.3)',
        'glow-amber':  '0 0 30px rgba(245,166,35,0.25)',
        'card':        '0 4px 32px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
