import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function FloatingGradientSphere() {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return

        meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    })

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 128, 128]} scale={1.8}>
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

function WaveLines() {
    const lines = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            top: i * 8,
            duration: 6 + i * 0.3,
            delay: i * 0.2,
        }))
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden opacity-20">
            {lines.map((line) => (
                <motion.div
                    key={line.id}
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                        repeat: Infinity,
                        duration: line.duration,
                        ease: 'linear',
                        delay: line.delay,
                    }}
                    className="absolute h-[1px] w-[300px] bg-gradient-to-r from-transparent via-[#33114b] to-transparent"
                    style={{
                        top: `${line.top}%`,
                    }}
                />
            ))}
        </div>
    )
}

export default function Contact() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#05010d] text-white">
            {/* Mesh Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ac44f722,transparent_35%)]" />

            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6b309c]/20 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[#ac44f7]/10 blur-3xl" />

            {/* Animated Lines */}
            <WaveLines />

            {/* 3D Background */}
            <div className="absolute inset-0 opacity-60">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[2, 2, 5]} intensity={2} />

                    <FloatingGradientSphere />
                </Canvas>
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20">
                <div className="grid w-full gap-14 lg:grid-cols-2">
                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="flex flex-col justify-center"
                    >
                        <div className="mb-6 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
                            <div className="mr-2 h-2 w-2 rounded-full bg-[#ac44f7]" />
                            <span className="text-sm text-zinc-300">
                                AI Voice Communication
                            </span>
                        </div>

                        <h1 className="text-5xl font-black leading-tight md:text-7xl">
                            Let’s Build
                            <span className="block bg-gradient-to-r from-[#ffffff] via-[#d8b4fe] to-[#ac44f7] bg-clip-text text-transparent">
                                Something Amazing
                            </span>
                        </h1>

                        <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
                            Have a project, idea, or collaboration in mind? Reach out and
                            let’s create intelligent voice experiences together.
                        </p>

                        <div className="mt-12 space-y-5">
                            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ac44f7]/10">
                                    <Mail className="h-5 w-5 text-[#d8b4fe]" />
                                </div>

                                <div>
                                    <p className="text-sm text-zinc-500">Email</p>
                                    <p className="text-lg text-zinc-200">
                                        contact@aivoice.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ac44f7]/10">
                                    <Phone className="h-5 w-5 text-[#d8b4fe]" />
                                </div>

                                <div>
                                    <p className="text-sm text-zinc-500">Phone</p>
                                    <p className="text-lg text-zinc-200">
                                        +91 98765 43210
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ac44f7]/10">
                                    <MapPin className="h-5 w-5 text-[#d8b4fe]" />
                                </div>

                                <div>
                                    <p className="text-sm text-zinc-500">Location</p>
                                    <p className="text-lg text-zinc-200">
                                        New Delhi, India
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right */}
                    <motion.div
                        initial={{ opacity: 0, y: 80 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#ac44f7]/20 to-[#6b309c]/10 blur-3xl" />

                        {/* Card */}
                        <div className="relative rounded-[32px] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-2xl md:p-10">
                            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.08] to-transparent" />

                            <div className="relative">
                                <h2 className="text-3xl font-bold">
                                    Send a Message
                                </h2>

                                <p className="mt-3 text-zinc-400">
                                    We’d love to hear from you.
                                </p>

                                <form className="mt-10 space-y-6">
                                    <div>
                                        <label className="mb-3 block text-sm text-zinc-400">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none transition-all duration-300 placeholder:text-zinc-600 focus:border-[#ac44f7]/50 focus:bg-white/[0.05]"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-3 block text-sm text-zinc-400">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none transition-all duration-300 placeholder:text-zinc-600 focus:border-[#ac44f7]/50 focus:bg-white/[0.05]"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-3 block text-sm text-zinc-400">
                                            Message
                                        </label>

                                        <textarea
                                            rows={5}
                                            placeholder="Write your message..."
                                            className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none transition-all duration-300 placeholder:text-zinc-600 focus:border-[#ac44f7]/50 focus:bg-white/[0.05]"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{
                                            scale: 1.03,
                                        }}
                                        whileTap={{
                                            scale: 0.97,
                                        }}
                                        className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#ac44f7] to-[#6b309c] px-6 py-4 text-lg font-semibold transition-all duration-300"
                                    >
                                        Send Message

                                        <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}