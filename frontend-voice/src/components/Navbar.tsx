import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'
import { cn } from '../lib/utils'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Demo', href: '#demo' },
  { label: 'Features', href: '#features' },
]

interface Props {
  onOpenApp: () => void
  theme: Theme
  onToggleTheme: () => void
}

export default function Navbar({ onOpenApp, theme, onToggleTheme }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 transition-all duration-500 md:px-12',
        scrolled && 'border-b border-border bg-canvas/80 backdrop-blur-2xl',
      )}
    >
      <a href="#" className="flex items-center gap-2.5" data-cursor="true">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet font-mono text-sm font-bold text-white shadow-glow-violet">
          W
        </div>
        <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Weblyrix
        </span>
      </a>

      <nav className="hidden items-center gap-8 md:flex">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group relative font-mono text-[0.72rem] uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            {item.label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-violet transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        <button
          onClick={onOpenApp}
          className="inline-flex items-center gap-2 rounded-md border border-violet/40 px-5 py-2 font-mono text-[0.72rem] uppercase tracking-widest text-violet transition-all duration-250 hover:bg-violet hover:text-white hover:shadow-glow-violet"
        >
          Open App
        </button>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} compact />
        <button
          type="button"
          className="text-muted transition-colors hover:text-primary"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute left-0 right-0 top-full flex flex-col gap-5 border-b border-border bg-surface px-6 py-6 md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-mono text-sm uppercase tracking-widest text-muted hover:text-primary"
              >
                {item.label}
              </a>
            ))}
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} className="justify-start" />
            <button
              onClick={() => {
                setOpen(false)
                onOpenApp()
              }}
              className="rounded-md border border-violet/40 px-4 py-2 text-center font-mono text-sm uppercase tracking-widest text-violet"
            >
              Open App
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
