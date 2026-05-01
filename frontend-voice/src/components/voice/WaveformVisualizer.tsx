import { motion } from 'framer-motion'

interface Props {
  audioLevel: number
  isActive: boolean
  barCount?: number
}

export default function WaveformVisualizer({ audioLevel, isActive, barCount = 40 }: Props) {
  return (
    <div className="flex h-14 w-full max-w-xs items-center justify-center gap-[2px]">
      {Array.from({ length: barCount }).map((_, index) => {
        const center = barCount / 2
        const distance = Math.abs(index - center) / center
        const peak = isActive ? (1 - distance * 0.55) * (audioLevel / 100) : 0.08

        return (
          <motion.div
            key={index}
            className="w-[2.5px] rounded-full bg-gradient-to-t from-violet via-violet-light to-teal"
            animate={{
              scaleY: isActive
                ? [0.1 + peak * 0.4, 0.1 + peak, 0.1 + peak * 0.5, 0.1 + peak * 0.8]
                : [0.08, 0.12, 0.08],
              opacity: isActive ? 0.9 : 0.24,
            }}
            transition={{
              repeat: Infinity,
              duration: isActive ? 0.55 + (index % 5) * 0.06 : 2.5,
              delay: index * 0.022,
              ease: 'easeInOut',
            }}
            style={{ height: 48, transformOrigin: 'center' }}
          />
        )
      })}
    </div>
  )
}
