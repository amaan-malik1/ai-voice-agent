import { useState, useEffect } from 'react'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import HowItWorks from './components/HowItWorks'
import VoiceDemo from './components/VoiceDemo'
import Features from './components/Features'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import AppShell from './pages/AppShell'

type View = 'landing' | 'app'

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      setScrollPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // App shell (voice/chat interface)
  if (view === 'app') {
    return (
      <div className="h-screen w-screen bg-black overflow-hidden">
        <Cursor />
        {/* Back to landing */}
        <button
          onClick={() => setView('landing')}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] font-mono text-[0.6rem] tracking-widest uppercase text-white/30 hover:text-white/60 border border-white/10 hover:border-white/20 bg-black/80 backdrop-blur-sm px-4 py-1.5 rounded-full transition-all"
        >
          ← Back to landing
        </button>
        <AppShell />
      </div>
    )
  }

  // Landing page
  return (
    <div className="relative min-h-screen bg-canvas font-sans">
      <div className="pointer-events-none fixed inset-0 z-[200] opacity-30"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")" }}
        aria-hidden
      />
      <div
        className="fixed top-0 left-0 z-[300] h-[2px] bg-gradient-violet transition-[width] duration-100"
        style={{ width: `${scrollPct}%`, background: 'linear-gradient(90deg, #7B5CF5, #22D3EE)' }}
        aria-hidden
      />
      <Cursor />
      <Navbar onOpenApp={() => setView('app')} />
      <main>
        <Hero onOpenApp={() => setView('app')} />
        <Marquee />
        <HowItWorks />
        <VoiceDemo />
        <Features />
        <CTASection onOpenApp={() => setView('app')} />
      </main>
      <Footer />
    </div>
  )
}
