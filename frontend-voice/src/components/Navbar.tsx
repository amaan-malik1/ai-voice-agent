import { useEffect, useState } from 'react'
import { Link } from 'react-router'
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
    <>
      {/* Floating Nav */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-6 inset-x-0 z-[5000] flex justify-center"
      >
        <div
          className={cn(
            "flex w-[80%] max-w-[1200px] items-center justify-between gap-3 rounded-full px-4 py-2 transition-all duration-300",

            // ✨ LIGHT MODE
            scrolled
              ? "bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-black/10"
              : "bg-white/70 backdrop-blur-md shadow-[0_5px_20px_rgba(0,0,0,0.06)] border border-black/5",

            // 🌙 DARK MODE
            scrolled
              ? "dark:bg-black/70 dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] dark:border-white/10"
              : "dark:bg-black/40 dark:shadow-[0_5px_20px_rgba(0,0,0,0.3)] dark:border-white/5"
          )}
        >
          {/* Logo */}
          <Link to={'/'} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet text-white text-sm font-bold">
              W
            </div>
            <span className="hidden sm:block font-semibold text-sm text-neutral-800 dark:text-white">
              Weblyrix
            </span>
          </Link>

          {/* Nav Items */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
            <button
              onClick={onOpenApp}
              className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 transition ease-in-out duration-500 transform dark:bg-white hover:text-white dark:text-black"
            >
              Open Chat
            </button>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
            <button onClick={() => setOpen((v) => !v)}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 inset-x-4 z-[4000] rounded-2xl border bg-white/90 backdrop-blur-xl p-5 shadow-lg dark:bg-black/80 dark:border-white/10"
          >
            <div className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-neutral-700 dark:text-neutral-300"
                >
                  {item.label}
                </a>
              ))}

              <ThemeToggle
                theme={theme}
                onToggleTheme={onToggleTheme}
                className="justify-start"
              />

              <button
                onClick={() => {
                  setOpen(false)
                  onOpenApp()
                }}
                className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-black transition-all ease-in-out duration-500 transform"
              >
                Open Chat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}