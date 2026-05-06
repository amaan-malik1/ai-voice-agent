import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import {
  Canvas,
  useFrame,
  useThree,
} from '@react-three/fiber'
import {
  Float,
  Line,
  MeshDistortMaterial,
  OrbitControls,
  Sphere,
} from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import FlipText from './FlipText'
import type { Theme } from '../hooks/useTheme'

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

function CameraMotion() {
  const { camera, mouse } = useThree()

  useFrame(() => {
    camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.03
    camera.position.y += (-mouse.y * 0.7 - camera.position.y) * 0.03

    camera.lookAt(0, 0, 0)
  })

  return null
}

function VoiceWaveRing({
  radius,
  color,
  speed,
}: {
  radius: number
  color: string
  speed: number
}) {
  const ref = useRef<THREE.Group>(null)

  const points = useMemo(() => {
    const pts = []

    for (let i = 0; i <= 240; i++) {
      const angle = (i / 240) * Math.PI * 2

      const wave =
        Math.sin(angle * 8) * 0.08 +
        Math.cos(angle * 4) * 0.05

      const r = radius + wave

      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * r,
          Math.sin(angle) * r,
          Math.sin(angle * 3) * 0.15
        )
      )
    }

    return pts
  }, [radius])

  useFrame((state) => {
    if (!ref.current) return

    ref.current.rotation.z =
      state.clock.elapsedTime * speed

    ref.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.2
  })

  return (
    <group ref={ref}>
      <Line
        points={points}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.9}
      />
    </group>
  )
}

function NeuralGrid() {
  const lines = useMemo(() => {
    return Array.from({ length: 30 }).map(() => [
      [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6,
      ],
      [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6,
      ],
    ])
  }, [])

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line as any}
          color="#ffffff"
          transparent
          opacity={0.05}
          lineWidth={1}
        />
      ))}
    </>
  )
}

function AIOrb() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return

    meshRef.current.rotation.x =
      state.clock.elapsedTime * 0.15

    meshRef.current.rotation.y =
      state.clock.elapsedTime * 0.2
  })

  return (
    <Float
      speed={2}
      rotationIntensity={1.5}
      floatIntensity={2}
    >
      <Sphere
        ref={meshRef}
        args={[1, 128, 128]}
        scale={1.6}
      >
        <MeshDistortMaterial
          color="#ac44f7"
          distort={0.45}
          speed={2}
          roughness={0}
        />
      </Sphere>
    </Float>
  )
}

function VoiceScene() {
  return (
    <>
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[3, 3, 5]}
        intensity={2}
      />

      <fog attach="fog" args={['#05010d', 5, 14]} />

      <CameraMotion />

      <NeuralGrid />

      <AIOrb />

      <VoiceWaveRing
        radius={2.2}
        color="#ac44f7"
        speed={0.08}
      />

      <VoiceWaveRing
        radius={2.7}
        color="#d8b4fe"
        speed={-0.05}
      />

      <VoiceWaveRing
        radius={3.2}
        color="#ffffff"
        speed={0.03}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.15}
      />
    </>
  )
}

export default function Hero({
  onOpenApp,
  theme,
}: {
  onOpenApp: () => void
  theme: Theme
}) {
  const heroGradientClass =
    theme === 'dark'
      ? 'text-gradient-violet'
      : 'text-gradient-ink'

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#05010d]"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ac44f7]/10 blur-3xl" />

        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#6b309c]/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-[#d8b4fe]/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage:
              'radial-gradient(circle at center, black 30%, transparent 90%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col-reverse items-center justify-center gap-10 px-4 pb-20 pt-32 sm:px-6 md:px-10 lg:flex-row lg:gap-16 lg:pb-0">

        {/* LEFT CONTENT */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-1 flex-col text-center lg:text-left"
        >
          <motion.div
            variants={itemVariants}
            className="mb-7"
          >
            <span className="inline-flex items-center gap-2 self-center rounded-full border border-violet/20 bg-white/[0.04] px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-violet backdrop-blur-xl lg:self-start">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              AI Voice Assistant
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-6 font-display font-black leading-[0.92] tracking-tight text-white"
            style={{
              fontSize: 'clamp(2.8rem, 12vw, 6.5rem)',
            }}
          >
            <span className="block">
              Speak.
            </span>

            <span className="block">
              <FlipText
                words={[
                  'Think.',
                  'Learn.',
                  'Reply.',
                  'Grow.',
                ]}
                className={heroGradientClass}
                minWidth="6ch"
              />
            </span>

            <span className="block">
              Repeat.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-[34rem] font-mono text-[0.82rem] leading-[1.95] text-zinc-400 sm:text-[0.9rem] lg:mx-0"
          >
            Experience intelligent voice-first communication powered by
            advanced AI. Speak naturally, receive instant responses, and
            interact with technology like never before.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 sm:flex-row lg:justify-start"
          >
            <button
              onClick={onOpenApp}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ac44f7] to-[#6b309c] px-7 py-4 font-mono text-[0.78rem] font-bold uppercase tracking-widest text-white transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(172,68,247,0.45)]"
            >
              Open Chat

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-4 font-mono text-[0.78rem] uppercase tracking-widest text-zinc-300 backdrop-blur-xl transition-all duration-300 hover:border-[#ac44f7]/40 hover:bg-white/[0.06]"
            >
              How It Works
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT ORBIT */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            delay: 0.3,
          }}
          className="relative flex h-[380px] w-full flex-1 items-center justify-center sm:h-[500px] lg:h-[700px]"
        >
          {/* Floating Card */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: 'easeInOut',
            }}
            className="absolute left-2 top-10 z-20 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl sm:left-10 sm:top-24"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:text-xs">
              Status
            </p>

            <p className="mt-1 text-sm font-semibold text-emerald-400 sm:text-lg">
              Listening...
            </p>
          </motion.div>

          {/* Floating Card */}
          <motion.div
            animate={{
              y: [12, -12, 12],
            }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: 'easeInOut',
            }}
            className="absolute bottom-10 right-2 z-20 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl sm:bottom-24 sm:right-10"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:text-xs">
              AI
            </p>

            <p className="mt-1 text-sm font-semibold text-violet-300 sm:text-lg">
              Processing
            </p>
          </motion.div>

          {/* 3D Canvas */}
          <div className="h-full w-full">
            <Canvas camera={{ position: [0, 0, 8] }}>
              <VoiceScene />
            </Canvas>
          </div>
        </motion.div>
      </div>
    </section>
  )
}