import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const [hovered, setHovered] = useState(false)
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const dotX = useSpring(mouseX, { stiffness: 2000, damping: 80 })
  const dotY = useSpring(mouseY, { stiffness: 2000, damping: 80 })
  const ringX = useSpring(mouseX, { stiffness: 120, damping: 20 })
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 20 })

  useEffect(() => {
    const move = (event: MouseEvent) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }

    const addHover = () => setHovered(true)
    const removeHover = () => setHovered(false)

    window.addEventListener('mousemove', move)

    const interactiveEls = document.querySelectorAll('button, a, [data-cursor]')
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      interactiveEls.forEach((el) => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
    }
  }, [mouseX, mouseY])

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[10000] rounded-full bg-violet opacity-90 shadow-glow-violet"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: hovered ? 24 : 12, height: hovered ? 24 : 12 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full border border-violet/50 bg-violet/5"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: hovered ? 56 : 40, height: hovered ? 56 : 40, opacity: hovered ? 0.28 : 0.45 }}
        transition={{ duration: 0.25 }}
      />
    </>
  )
}
