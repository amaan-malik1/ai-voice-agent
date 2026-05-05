import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Mic } from 'lucide-react'
import { cn } from '../lib/utils'
import type { RecordingState } from '../types'

interface VoiceOrbProps {
  state: RecordingState
  onClick?: () => void
  size?: 'lg' | 'md'
}

const STATE_COLORS: Record<RecordingState, string> = {
  idle:       'from-violet to-teal',
  recording:  'from-red-500 to-rose-400',
  processing: 'from-amber to-yellow-300',
  speaking:   'from-teal to-emerald-400',
}

const STATE_RING_COLORS: Record<RecordingState, string> = {
  idle:       'border-violet/20',
  recording:  'border-red-500/25',
  processing: 'border-amber/25',
  speaking:   'border-teal/25',
}

const STATE_LABELS: Record<RecordingState, string> = {
  idle:       'Click to speak',
  recording:  'Listening…',
  processing: 'Thinking…',
  speaking:   'Speaking…',
}

export default function VoiceOrb({ state, onClick, size = 'lg' }: VoiceOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [14, -14]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-14, 14]), { stiffness: 200, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width  / 2)
    mouseY.set(e.clientY - rect.top  - rect.height / 2)
  }
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }

  const orbSize = size === 'lg' ? 'w-64 h-64' : 'w-44 h-44'
  const iconSize = size === 'lg' ? 52 : 36

  return (
    <div className="flex flex-col items-center gap-5 select-none">
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
          onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
          className={cn(
            'relative flex items-center justify-center rounded-full cursor-pointer',
            orbSize,
            onClick && 'cursor-pointer'
          )}
        >
          {/* Spinning conic ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: state === 'recording' ? 2 : 9, ease: 'linear' }}
            className={cn(
              'absolute inset-0 rounded-full bg-gradient-to-br p-[3px]',
              STATE_COLORS[state]
            )}
          >
            <div className="w-full h-full rounded-full bg-canvas" />
          </motion.div>

          {/* Ripple rings */}
          {([0,1,2,3]).map((i) => (
            <div
              key={i}
              className={cn('absolute rounded-full border', STATE_RING_COLORS[state])}
              style={{
                inset: `${-15 - i * 18}px`,
                animationName: 'ripple',
                animationDelay: `${i}s`,
                animationDuration: '4s',
                animationTimingFunction: 'ease-out',
                animationIterationCount: 'infinite',
              }}
            />
          ))}

          {/* Inner glow core */}
          <div className="absolute inset-[14px] rounded-full bg-radial-[at_40%_35%] from-violet/20 to-canvas/95 flex items-center justify-center z-10">
            <motion.div
              animate={{ scale: state === 'recording' ? [1, 1.15, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <Mic
                size={iconSize}
                className={cn(
                  'transition-colors duration-300 drop-shadow-[0_0_12px_currentColor]',
                  state === 'idle'       && 'text-violet',
                  state === 'recording'  && 'text-red-400',
                  state === 'processing' && 'text-amber',
                  state === 'speaking'   && 'text-teal',
                )}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Floating tag pills */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute -top-2 -right-4 font-mono text-[0.6rem] tracking-widest uppercase text-violet bg-violet/10 border border-violet/25 px-3 py-1.5 rounded-md whitespace-nowrap backdrop-blur-sm"
        >
          STT · Whisper
        </motion.div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute -bottom-4 -left-6 font-mono text-[0.6rem] tracking-widest uppercase text-teal bg-teal/10 border border-teal/25 px-3 py-1.5 rounded-md whitespace-nowrap backdrop-blur-sm"
        >
          LLaMA 3 / GPT
        </motion.div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
          className="absolute top-1/2 -right-16 -translate-y-1/2 font-mono text-[0.6rem] tracking-widest uppercase text-amber bg-amber/10 border border-amber/25 px-3 py-1.5 rounded-md whitespace-nowrap backdrop-blur-sm"
        >
          ElevenLabs TTS
        </motion.div>
      </div>

      {/* State label */}
      <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className={cn(
            'w-2 h-2 rounded-full flex-shrink-0',
            state === 'idle'       && 'bg-muted',
            state === 'recording'  && 'bg-red-400',
            state === 'processing' && 'bg-amber',
            state === 'speaking'   && 'bg-teal',
          )}
        />
        <span className="font-mono text-[0.68rem] tracking-widest text-subtle">
          {STATE_LABELS[state]}
        </span>
      </div>
    </div>
  )
}
