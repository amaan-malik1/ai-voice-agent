import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Loader2, Mic, Square, Volume2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { RecordingState } from '../../types'

interface Props {
  state: RecordingState
  audioLevel?: number
  onStart: () => void
  onStop: () => void
}

const CFG: Record<RecordingState, { label: string; icon: typeof Mic; spin: number }> = {
  idle: { label: 'Tap to speak', icon: Mic, spin: 9 },
  recording: { label: 'Listening... tap to stop', icon: Square, spin: 2 },
  processing: { label: 'Processing...', icon: Loader2, spin: 1.2 },
  speaking: { label: 'Speaking...', icon: Volume2, spin: 5 },
}

const RING_GRADIENT: Record<RecordingState, string> = {
  idle: 'from-violet via-violet-light to-teal',
  recording: 'from-red-500 via-rose-400 to-red-600',
  processing: 'from-amber via-amber-light to-violet-light',
  speaking: 'from-teal via-violet-light to-emerald-400',
}

const HALO_COLOR: Record<RecordingState, string> = {
  idle: 'bg-violet/25',
  recording: 'bg-red-500/25',
  processing: 'bg-amber/25',
  speaking: 'bg-teal/25',
}

const ICON_COLOR: Record<RecordingState, string> = {
  idle: 'text-violet',
  recording: 'text-red-400',
  processing: 'text-amber',
  speaking: 'text-teal',
}

export default function VoiceOrb({ state, audioLevel = 0, onStart, onStop }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const cfg = CFG[state]
  const Icon = cfg.icon

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-150, 150], [14, -14]), { stiffness: 180, damping: 26 })
  const ry = useSpring(useTransform(mx, [-150, 150], [-14, 14]), { stiffness: 180, damping: 26 })

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(event.clientX - rect.left - rect.width / 2)
    my.set(event.clientY - rect.top - rect.height / 2)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const onClick = () => {
    if (state === 'idle') onStart()
    else if (state === 'recording') onStop()
  }

  const scale = state === 'recording' ? 1 + (audioLevel / 100) * 0.07 : 1

  return (
    <div className="flex select-none flex-col items-center gap-6">
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="relative" style={{ perspective: '900px' }}>
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={cn('pointer-events-none absolute rounded-full border border-border', state === 'recording' && 'border-violet/25')}
            style={{
              inset: `${-(index + 1) * 20}px`,
              animationName: 'ripple',
              animationDuration: '4s',
              animationDelay: `${index}s`,
              animationTimingFunction: 'ease-out',
              animationIterationCount: 'infinite',
            }}
          />
        ))}

        <motion.div
          style={{ rotateX: rx, rotateY: ry }}
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => event.key === 'Enter' && onClick()}
          aria-label={cfg.label}
          className="relative flex h-48 w-48 cursor-pointer items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: cfg.spin, ease: 'linear' }}
            className={cn('absolute inset-0 rounded-full bg-gradient-to-br p-[2.5px]', RING_GRADIENT[state])}
          >
            <div className="h-full w-full rounded-full bg-canvas" />
          </motion.div>

          <div className={cn('absolute inset-1 rounded-full blur-2xl opacity-30', HALO_COLOR[state])} />

          <div className="absolute inset-4 z-10 flex items-center justify-center rounded-full border border-border/50 bg-gradient-to-b from-card to-canvas shadow-card">
            <motion.div
              animate={state === 'speaking' ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            >
              <Icon
                size={48}
                className={cn(
                  'drop-shadow-[0_0_14px_currentColor] transition-colors duration-300',
                  ICON_COLOR[state],
                  state === 'processing' && 'animate-spin',
                )}
                strokeWidth={1.5}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 shadow-card theme-transition">
        <motion.span
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className={cn(
            'h-1.5 w-1.5 flex-shrink-0 rounded-full',
            state === 'idle' && 'bg-muted',
            state === 'recording' && 'bg-red-400',
            state === 'processing' && 'bg-amber',
            state === 'speaking' && 'bg-teal',
          )}
        />
        <span className="font-mono text-[0.68rem] tracking-widest text-subtle">{cfg.label}</span>
      </div>
    </div>
  )
}
