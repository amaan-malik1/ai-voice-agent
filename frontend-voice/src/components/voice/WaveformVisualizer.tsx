import { motion } from 'framer-motion'

interface Props { audioLevel: number; isActive: boolean; barCount?: number }

export default function WaveformVisualizer({ audioLevel, isActive, barCount = 40 }: Props) {
  return (
    <div className="flex items-center justify-center gap-[2px] h-14 w-full max-w-xs">
      {Array.from({ length: barCount }).map((_, i) => {
        const center = barCount / 2
        const dist   = Math.abs(i - center) / center
        const peak   = isActive ? (1 - dist * 0.55) * (audioLevel / 100) : 0.08
        return (
          <motion.div
            key={i}
            className="w-[2.5px] rounded-full bg-white"
            animate={{
              scaleY: isActive
                ? [0.1 + peak * 0.4, 0.1 + peak, 0.1 + peak * 0.5, 0.1 + peak * 0.8]
                : [0.08, 0.12, 0.08],
              opacity: isActive ? 0.9 : 0.2,
            }}
            transition={{
              repeat: Infinity,
              duration: isActive ? 0.55 + (i % 5) * 0.06 : 2.5,
              delay: i * 0.022,
              ease: 'easeInOut',
            }}
            style={{ height: 48, transformOrigin: 'center' }}
          />
        )
      })}
    </div>
  )
}
