import { Canvas, useFrame } from '@react-three/fiber'
import {
    Float,
    MeshDistortMaterial,
    OrbitControls,
    Sphere,
    Stars,
} from '@react-three/drei'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function AnimatedOrb() {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return

        meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    })

    return (
        <Float speed={2} rotationIntensity={2} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1.2, 128, 128]} scale={2.4}>
                <MeshDistortMaterial
                    color="#ac44f7"
                    distort={0.45}
                    speed={2.5}
                    roughness={0}
                />
            </Sphere>
        </Float>
    )
}

const NotFound = () => {
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        gsap.fromTo(
            '.title',
            {
                opacity: 0,
                y: 100,
                scale: 0.7,
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.4,
                ease: 'power4.out',
            }
        )

        gsap.fromTo(
            '.subtitle',
            {
                opacity: 0,
                y: 40,
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.4,
            }
        )

        gsap.fromTo(
            '.description',
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: 1,
                delay: 0.8,
            }
        )

        gsap.to(buttonRef.current, {
            boxShadow: '0px 0px 40px rgba(172,68,247,0.5)',
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: 'power1.inOut',
        })
    }, [])

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-[#05010d] text-white">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ac44f722,transparent_40%)]" />
            <div className="absolute bottom-0 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-[#6b309c]/20 blur-3xl" />

            {/* Three.js */}
            <div className="absolute inset-0">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[2, 2, 5]} intensity={2} />

                    <Stars
                        radius={100}
                        depth={50}
                        count={5000}
                        factor={4}
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
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
                <motion.h1
                    className="title bg-gradient-to-r from-white via-[#d8b4fe] to-[#ac44f7] bg-clip-text text-7xl font-black tracking-tight text-transparent md:text-[10rem]"
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

                <h2 className="subtitle mt-2 text-3xl font-semibold md:text-5xl">
                    Page Not Found
                </h2>

                <p className="description mt-6 max-w-xl text-lg leading-8 text-zinc-400">
                    The page you are looking for does not exist or may have been moved.
                </p>

                <motion.button
                    ref={buttonRef}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-10 rounded-2xl bg-gradient-to-r from-[#ac44f7] to-[#6b309c] px-8 py-4 text-lg font-semibold"
                >
                    Go Back Home
                </motion.button>
            </div>
        </div>
    )
}

export default NotFound