import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function AnimatedOrb() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return

    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.25
  })

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1.4, 128, 128]} scale={2.2}>
        <MeshDistortMaterial
          color="#ac44f7"
          attach="material"
          distort={0.45}
          speed={2.5}
          roughness={0}
        />
      </Sphere>
    </Float>
  )
}

export function NotFound() {
  const textRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    tl.fromTo(
      '.not-found-title',
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power4.out',
      }
    )

    tl.fromTo(
      '.not-found-text',
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
      },
      '-=0.7'
    )

    tl.fromTo(
      '.not-found-button',
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
      },
      '-=0.5'
    )

    gsap.to(buttonRef.current, {
      boxShadow: '0px 0px 40px rgba(172,68,247,0.45)',
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: 'power1.inOut',
    })
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#05010d] text-white">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ac44f722,transparent_45%)]" />
      <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#6b309c]/20 blur-3xl" />

      {/* Three.js Scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={1.4} />
          <directionalLight position={[2, 2, 5]} intensity={2} />

          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />

          <AnimatedOrb />

          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1.5}
          />
        </Canvas>
      </div>

      {/* Content */}
      <motion.div
        ref={textRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.h1
          className="not-found-title bg-gradient-to-r from-[#ffffff] via-[#d9b8ff] to-[#ac44f7] bg-clip-text text-7xl font-black tracking-tight text-transparent md:text-[10rem]"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          404
        </motion.h1>

        <motion.h2
          className="not-found-text mt-4 text-3xl font-semibold md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Lost in Space
        </motion.h2>

        <motion.p
          className="mt-6 max-w-xl text-lg leading-8 text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          The page you are looking for does not exist or has been moved into another dimension.
        </motion.p>

        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="not-found-button mt-10 rounded-2xl bg-gradient-to-r from-[#ac44f7] to-[#6b309c] px-8 py-4 text-lg font-semibold transition-all duration-300"
        >
          Return Home
        </motion.button>
      </motion.div>
    </div>
  )
}

export default function AboutPage() {
  const features = [
    {
      title: 'Fast Conversations',
      description: 'Real-time AI voice responses with smooth interaction.',
    },
    {
      title: 'Natural Voice',
      description: 'Human-like communication designed for modern experiences.',
    },
    {
      title: 'Reliable System',
      description: 'Built for stability, performance, and scalability.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#07070c] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-28 md:px-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-zinc-500">
            About Us
          </p>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Building Modern
            <span className="block bg-gradient-to-r from-[#ac44f7] to-[#6b309c] bg-clip-text text-transparent">
              AI Voice Experiences
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-zinc-400">
            Our platform combines conversational AI and voice technology to create fast,
            intelligent, and seamless interactions for modern applications.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:opacity-90">
              Get Started
            </button>

            <button className="rounded-xl border border-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/5">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-white/5">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2 md:px-10">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
              Who We Are
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Simple. Intelligent. Human.
            </h2>

            <p className="mt-6 leading-8 text-zinc-400">
              We focus on building voice-first AI systems that feel natural and responsive.
              Our goal is to simplify digital communication using clean design and advanced AI.
            </p>

            <p className="mt-6 leading-8 text-zinc-400">
              Designed with performance and usability in mind, the platform delivers a minimal
              and premium experience across devices.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-zinc-500">Mission</p>
                <p className="mt-2 text-lg leading-8 text-zinc-300">
                  To create accessible AI voice experiences that feel effortless and natural.
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-sm text-zinc-500">Vision</p>
                <p className="mt-2 text-lg leading-8 text-zinc-300">
                  Making voice interaction the future of digital communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10">
          <div className="mb-14">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
              Features
            </p>

            <h2 className="mt-4 text-4xl font-semibold">
              Built for modern AI communication.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-white/20"
              >
                <div className="mb-5 h-2 w-12 rounded-full bg-gradient-to-r from-[#ac44f7] to-[#6b309c]" />

                <h3 className="text-2xl font-semibold">{feature.title}</h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center md:px-10">
          <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
            Ready to build with AI voice?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-zinc-400">
            Create smarter and more natural digital experiences with modern AI voice technology.
          </p>

          <button className="mt-10 rounded-xl bg-gradient-to-r from-[#ac44f7] to-[#6b309c] px-8 py-4 font-medium transition hover:opacity-90">
            Launch Platform
          </button>
        </div>
      </section>
    </div>
  )
}
