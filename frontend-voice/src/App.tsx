import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import HowItWorks from './components/HowItWorks'
import VoiceDemo from './components/VoiceDemo'
import Features from './components/Features'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import useTheme from './hooks/useTheme'
import AppShell from './pages/AppShell'
import ThemeToggle from './components/ThemeToggle'

type View = 'landing' | 'app'

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [scrollPct, setScrollPct] = useState(0)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const maxScroll = Math.max(el.scrollHeight - el.clientHeight, 1)
      setScrollPct((el.scrollTop / maxScroll) * 100)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (view === 'app') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-canvas text-primary theme-transition">
        <div className="fixed top-4 left-1/2 z-[220] flex -translate-x-1/2 items-center gap-2">
          <button
            onClick={() => setView('landing')}
            className="rounded-full border border-border bg-surface/85 px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-muted backdrop-blur-sm transition-all hover:border-border-bright hover:text-primary"
          >
            Back to landing
          </button>
          <ThemeToggle theme={theme} onToggleTheme={toggleTheme} />
        </div>
        <AppShell />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-canvas font-sans text-primary theme-transition">
      <div
        className="pointer-events-none fixed inset-0 z-[200]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 'var(--noise-opacity)',
        }}
        aria-hidden
      />
      <div
        className="fixed top-0 left-0 z-[300] h-[2px] transition-[width] duration-100"
        style={{
          width: `${scrollPct}%`,
          background: 'linear-gradient(90deg, rgb(var(--color-violet)), rgb(var(--color-teal)))',
        }}
        aria-hidden
      />
      <Navbar
        onOpenApp={() => setView('app')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main>
        <Hero onOpenApp={() => setView('app')} theme={theme} />
        <Marquee />
        <HowItWorks theme={theme} />
        <VoiceDemo />
        <Features />
        <CTASection onOpenApp={() => setView('app')} />
      </main>
      <Footer />
    </div>
  )
}
