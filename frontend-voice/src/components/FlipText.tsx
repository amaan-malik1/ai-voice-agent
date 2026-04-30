import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface FlipTextProps {
  words: string[]
  interval?: number
  className?: string
}

export default function FlipText({ words, interval = 2200, className = '' }: FlipTextProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [words.length, interval])

  return (
    <span className={`relative inline-block overflow-hidden ${className}`} style={{ minWidth: '8ch' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="inline-block"
          initial={{ rotateX: -90, opacity: 0, y: 20 }}
          animate={{ rotateX: 0,   opacity: 1, y: 0  }}
          exit={{    rotateX:  90, opacity: 0, y: -20 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'bottom', display: 'inline-block' }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
