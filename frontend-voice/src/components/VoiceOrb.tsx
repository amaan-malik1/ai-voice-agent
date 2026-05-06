import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Mic } from 'lucide-react'
import { cn } from '../lib/utils'
import type { RecordingState } from '../types'

interface VoiceOrbProps {
  state: RecordingState
  onClick?: () => void
  size?: 'lg' | 'md' | 'hero'
}

const STATE_COLORS: Record<RecordingState, string> = {
  idle: 'from-violet to-teal',
  recording: 'from-red-500 to-rose-400',
  processing: 'from-amber to-yellow-300',
  speaking: 'from-teal to-emerald-400',
}

const STATE_RING_COLORS: Record<RecordingState, string> = {
  idle: 'border-violet/20',
  recording: 'border-red-500/25',
  processing: 'border-amber/25',
  speaking: 'border-teal/25',
}

const STATE_LABELS: Record<RecordingState, string> = {
  idle: 'Click to speak',
  recording: 'Listening...',
  processing: 'Thinking...',
  speaking: 'Speaking...',
}

export default function VoiceOrb({ state, onClick, size = 'lg' }: VoiceOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isHero = size === 'hero'

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [14, -14]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-14, 14]), { stiffness: 200, damping: 30 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(event.clientX - rect.left - rect.width / 2)
    mouseY.set(event.clientY - rect.top - rect.height / 2)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const orbSize =
    size === 'hero'
      ? 'h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-64 lg:w-64'
      : size === 'lg'
        ? 'h-64 w-64'
        : 'h-44 w-44'

  const iconClassName =
    size === 'hero'
      ? 'h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-[52px] lg:w-[52px]'
      : size === 'lg'
        ? 'h-[52px] w-[52px]'
        : 'h-9 w-9'

  return (
    <div className="flex select-none flex-col items-center gap-4 sm:gap-5">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative"
        style={{ perspective: '900px' }}
      >
        <motion.div
          style={{ rotateX, rotateY }}
          onClick={onClick}
          role={onClick ? 'button' : undefined}
          aria-label={onClick ? STATE_LABELS[state] : undefined}
          tabIndex={onClick ? 0 : undefined}
          onKeyDown={onClick ? (event) => event.key === 'Enter' && onClick() : undefined}
          className={cn(
            'relative flex cursor-pointer items-center justify-center rounded-full',
            orbSize,
            onClick && 'cursor-pointer',
          )}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: state === 'recording' ? 2 : 9, ease: 'linear' }}
            className={cn('absolute inset-0 rounded-full bg-gradient-to-br p-[3px]', STATE_COLORS[state])}
          >
            <div className="h-full w-full rounded-full bg-canvas" />
          </motion.div>

          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={cn('absolute rounded-full border', STATE_RING_COLORS[state])}
              style={{
                inset: `${-15 - index * 18}px`,
                animationName: 'ripple',
                animationDelay: `${index}s`,
                animationDuration: '4s',
                animationTimingFunction: 'ease-out',
                animationIterationCount: 'infinite',
              }}
            />
          ))}

          <div className="absolute inset-[14px] z-10 flex items-center justify-center rounded-full bg-radial-[at_40%_35%] from-violet/20 to-canvas/95">
            <motion.div
              animate={{ scale: state === 'recording' ? [1, 1.15, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <Mic
                className={cn(
                  iconClassName,
                  'drop-shadow-[0_0_12px_currentColor] transition-colors duration-300',
                  state === 'idle' && 'text-violet',
                  state === 'recording' && 'text-red-400',
                  state === 'processing' && 'text-amber',
                  state === 'speaking' && 'text-teal',
                )}
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className={cn(
            'absolute rounded-md border border-violet/25 bg-violet/10 font-mono uppercase whitespace-nowrap backdrop-blur-sm',
            isHero
              ? '-top-1 right-0 px-2 py-1 text-[0.48rem] tracking-[0.22em] sm:-top-2 sm:-right-4 sm:px-3 sm:py-1.5 sm:text-[0.6rem] sm:tracking-widest'
              : '-top-2 -right-4 px-3 py-1.5 text-[0.6rem] tracking-widest',
          )}
        >
          STT · Whisper
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className={cn(
            'absolute rounded-md border border-teal/25 bg-teal/10 font-mono uppercase tracking-widest whitespace-nowrap backdrop-blur-sm',
            isHero ? 'hidden px-3 py-1.5 text-[0.6rem] sm:-bottom-4 sm:-left-6 sm:block' : '-bottom-4 -left-6 px-3 py-1.5 text-[0.6rem]',
          )}
        >
          LLaMA 3 / GPT
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-md border border-amber/25 bg-amber/10 font-mono uppercase tracking-widest whitespace-nowrap backdrop-blur-sm',
            isHero ? 'hidden -right-16 px-3 py-1.5 text-[0.6rem] sm:block' : '-right-16 px-3 py-1.5 text-[0.6rem]',
          )}
        >
          ElevenLabs TTS
        </motion.div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className={cn(
            'h-2 w-2 flex-shrink-0 rounded-full',
            state === 'idle' && 'bg-muted',
            state === 'recording' && 'bg-red-400',
            state === 'processing' && 'bg-amber',
            state === 'speaking' && 'bg-teal',
          )}
        />
        <span className="font-mono text-[0.62rem] tracking-widest text-subtle sm:text-[0.68rem]">
          {STATE_LABELS[state]}
        </span>
      </div>
    </div>
  )
}
