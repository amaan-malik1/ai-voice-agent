import { Moon, Sun } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'
import { cn } from '../lib/utils'

interface Props {
  theme: Theme
  onToggleTheme: () => void
  className?: string
  compact?: boolean
}

export default function ThemeToggle({ theme, onToggleTheme, className, compact = false }: Props) {
  const isDark = theme === 'dark'
  const Icon = isDark ? Sun : Moon
  const label = isDark ? 'Light mode' : 'Dark mode'

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      title={label}
      aria-label={`Switch to ${label.toLowerCase()}`}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface/85 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-widest text-subtle backdrop-blur-sm transition-all hover:border-border-bright hover:text-primary',
        compact && 'w-10 px-0',
        className,
      )}
    >
      <Icon size={14} />
      {!compact && <span>{label}</span>}
    </button>
  )
}
