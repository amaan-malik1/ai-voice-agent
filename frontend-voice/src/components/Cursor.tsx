import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const [hovered, setHovered] = useState(false)
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Dot follows instantly
  const dotX = useSpring(mouseX, { stiffness: 2000, damping: 80 })
  const dotY = useSpring(mouseY, { stiffness: 2000, damping: 80 })

  // Ring follows with lag
  const ringX = useSpring(mouseX, { stiffness: 120, damping: 20 })
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 20 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const addHover = () => setHovered(true)
    const removeHover = () => setHovered(false)

    window.addEventListener('mousemove', move)

    const interactiveEls = document.querySelectorAll('button, a, [data-cursor]')
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
    }
  }, [mouseX, mouseY])

  return (
    <>
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed z-[10000] rounded-full bg-violet mix-blend-screen"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: hovered ? 24 : 12, height: hovered ? 24 : 12 }}
        transition={{ duration: 0.2 }}
      />
      {/* Ring */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full border border-violet/50"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: hovered ? 56 : 40, height: hovered ? 56 : 40, opacity: hovered ? 0.3 : 0.5 }}
        transition={{ duration: 0.25 }}
      />
    </>
  )
}
