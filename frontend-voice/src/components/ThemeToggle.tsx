import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'
import { cn } from '../lib/utils'

interface Props {
  theme: Theme
  onToggleTheme: () => void
  className?: string
  compact?: boolean
}

export default function ThemeToggle({ theme, onToggleTheme, className }: Props) {
  const isDark = theme === 'dark'

  return (
    <button
      onClick={onToggleTheme}
      className={cn(
        "relative flex h-8 w-16 items-center rounded-full px-1 transition-colors",
        "bg-neutral-200 dark:bg-neutral-700",
        className
      )}
    >
      {/* Sliding circle */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 32 : 0 }}
      >
        {isDark ? <Moon size={12} /> : <Sun size={12} />}
      </motion.div>

      {/* Icons background (optional subtle hint) */}
      <div className="flex w-full justify-between px-2 text-xs opacity-60">
        <Sun size={12} />
        <Moon size={12} />
      </div>
    </button>
  )
}