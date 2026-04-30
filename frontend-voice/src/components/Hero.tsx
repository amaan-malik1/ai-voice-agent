import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import VoiceOrb from './VoiceOrb'
import FlipText from './FlipText'

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.75, ease: 'easeOut' } },
}

const STATS = [
  { num: '99+',  label: 'Languages' },
  { num: '<1s',  label: 'Response' },
  { num: '∞',    label: 'Context' },
]

export default function Hero({ onOpenApp }: { onOpenApp: () => void }) {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 md:px-12 pt-24">

      {/* Background radial glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-teal/8 blur-[100px]" />
      </div>

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          backgroundImage: 'linear-gradient(rgba(123,92,245,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(123,92,245,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT — text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-7">
            <span className="inline-flex items-center gap-2.5 bg-violet/8 border border-violet/25 rounded-full px-4 py-2 font-mono text-[0.68rem] tracking-widest uppercase text-violet">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
              AI Voice Assistant · v1.0
            </span>
          </motion.div>

          {/* Heading with flip text */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-extrabold leading-[1.03] tracking-tight mb-6"
            style={{ fontSize: 'clamp(3rem, 6.5vw, 5.5rem)', color:'white' }}
          >
            Speak.&nbsp;
            <span className="text-white">
              <FlipText
                words={['Think.', 'Learn.', 'Reply.', 'Grow.']}
                className="text-gradient-violet"
              />
            </span>
            <br />
            <span className="text-white">Repeat.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="font-mono text-[0.82rem] text-subtle leading-[1.9] max-w-[480px] mb-9"
          >
            A seamless voice-first experience — your words converted to
            text, processed by AI, and spoken back in natural speech.
            Hands-free. Instant. Intelligent.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={onOpenApp}
              data-cursor="true"
              className="inline-flex items-center gap-2 bg-violet text-white font-mono font-bold text-[0.78rem] tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-violet-light hover:shadow-glow-violet transition-all duration-200 cursor-pointer border-0"
            >
              Open App <ArrowRight size={15} />
            </button>
            <a
              href="#how-it-works"
              data-cursor="true"
              className="inline-flex items-center gap-2 bg-transparent text-subtle font-mono text-[0.78rem] tracking-widest uppercase px-6 py-3 rounded-lg border border-border-bright hover:text-primary hover:border-violet/50 transition-all duration-200"
            >
              How It Works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="flex gap-3 flex-wrap">
            {STATS.map(s => (
              <div key={s.label} className="flex flex-col bg-card border border-border rounded-xl px-5 py-3 min-w-[90px]">
                <span className="font-display font-extrabold text-2xl text-violet-light leading-none mb-1">{s.num}</span>
                <span className="font-mono text-[0.62rem] tracking-widest uppercase text-muted">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          <VoiceOrb state="idle" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden>
        <div className="w-px h-14 bg-gradient-to-b from-violet to-transparent animate-scroll-drop origin-top" />
        <span className="font-mono text-[0.58rem] tracking-[0.25em] uppercase text-muted">Scroll</span>
      </div>
    </section>
  )
}
