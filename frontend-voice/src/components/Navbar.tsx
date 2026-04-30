import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'

const NAV_ITEMS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Demo',         href: '#demo' },
  { label: 'Features',     href: '#features' },
]

interface Props { onOpenApp: () => void }

export default function Navbar({ onOpenApp }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

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
        'fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500',
        scrolled && 'bg-canvas/80 backdrop-blur-2xl border-b border-border'
      )}
    >
      <a href="#" className="flex items-center gap-2.5" data-cursor="true">
        <div className="w-8 h-8 rounded-lg bg-violet flex items-center justify-center font-mono font-bold text-sm text-white shadow-glow-violet">W</div>
        <span className="font-display font-bold text-sm tracking-[0.18em] text-primary uppercase">Weblyrix</span>
      </a>

      <nav className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map(item => (
          <a key={item.href} href={item.href} data-cursor="true"
            className="font-mono text-[0.72rem] tracking-widest uppercase text-muted hover:text-primary transition-colors relative group">
            {item.label}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet group-hover:w-full transition-all duration-300" />
          </a>
        ))}
      </nav>

      <button onClick={onOpenApp} data-cursor="true"
        className="hidden md:inline-flex items-center gap-2 font-mono text-[0.72rem] tracking-widest uppercase text-violet border border-violet/40 px-5 py-2 rounded-md hover:bg-violet hover:text-white hover:shadow-glow-violet transition-all duration-250">
        Open App
      </button>

      <button className="md:hidden text-muted hover:text-primary" onClick={() => setOpen(v => !v)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="absolute top-full left-0 right-0 bg-surface border-b border-border px-6 py-6 flex flex-col gap-5 md:hidden">
            {NAV_ITEMS.map(i => (
              <a key={i.href} href={i.href} onClick={() => setOpen(false)}
                className="font-mono text-sm uppercase tracking-widest text-muted hover:text-primary">{i.label}</a>
            ))}
            <button onClick={() => { setOpen(false); onOpenApp() }}
              className="font-mono text-sm uppercase tracking-widest text-violet border border-violet/40 px-4 py-2 rounded-md text-center">
              Open App
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
