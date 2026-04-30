import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Mic, Square, Loader2, Volume2 } from 'lucide-react'
import type { RecordingState } from '../../types'

interface Props {
  state: RecordingState
  audioLevel?: number
  onStart: () => void
  onStop: () => void
}

const CFG: Record<RecordingState, { label: string; icon: typeof Mic; spin: number }> = {
  idle:       { label: 'Tap to speak',          icon: Mic,     spin: 9   },
  recording:  { label: 'Listening… tap to stop', icon: Square,  spin: 2   },
  processing: { label: 'Processing…',            icon: Loader2, spin: 1.2 },
  speaking:   { label: 'Speaking…',              icon: Volume2, spin: 5   },
}

export default function VoiceOrb({ state, audioLevel = 0, onStart, onStop }: Props) {
  const ref  = useRef<HTMLDivElement>(null)
  const cfg  = CFG[state]
  const Icon = cfg.icon

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-150, 150], [14, -14]), { stiffness: 180, damping: 26 })
  const ry = useSpring(useTransform(mx, [-150, 150], [-14, 14]), { stiffness: 180, damping: 26 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set(e.clientX - r.left - r.width / 2)
    my.set(e.clientY - r.top  - r.height / 2)
  }
  const onLeave = () => { mx.set(0); my.set(0) }
  const onClick  = () => { if (state === 'idle') onStart(); else if (state === 'recording') onStop() }

  const scale = state === 'recording' ? 1 + (audioLevel / 100) * 0.07 : 1

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="relative" style={{ perspective: '900px' }}>

        {/* Ripple rings — white only */}
        {[0,1,2,3].map(i => (
          <div key={i} className="absolute rounded-full border border-white/10 pointer-events-none"
            style={{
              inset: `${-(i+1)*20}px`,
              animationName: 'ripple', animationDuration: '4s',
              animationDelay: `${i}s`, animationTimingFunction: 'ease-out',
              animationIterationCount: 'infinite',
            }}
          />
        ))}

        {/* 3D Orb */}
        <motion.div
          style={{ rotateX: rx, rotateY: ry }}
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onClick()}
          aria-label={cfg.label}
          className="relative w-48 h-48 flex items-center justify-center cursor-pointer"
        >
          {/* Spinning ring — white/gray gradient */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: cfg.spin, ease: 'linear' }}
            className="absolute inset-0 rounded-full p-[2.5px]"
            style={{ background: 'conic-gradient(from 0deg, #ffffff, #555555, #ffffff, #333333, #ffffff)' }}
          >
            <div className="w-full h-full rounded-full bg-black" />
          </motion.div>

          {/* Glow halo */}
          <div className="absolute inset-0 rounded-full blur-2xl opacity-20 bg-white" />

          {/* Core */}
          <div className="absolute inset-4 rounded-full flex items-center justify-center z-10 bg-gradient-to-b from-white/10 to-black/80">
            <motion.div
              animate={state === 'speaking' ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            >
              <Icon
                size={48}
                className={
                  state === 'processing' ? 'text-white/60 animate-spin' :
                  state === 'recording'  ? 'text-white' :
                  'text-white/80'
                }
                strokeWidth={1.5}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* State pill */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2">
        <motion.span
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"
        />
        <span className="font-mono text-[0.68rem] tracking-widest text-white/50">{cfg.label}</span>
      </div>
    </div>
  )
}
