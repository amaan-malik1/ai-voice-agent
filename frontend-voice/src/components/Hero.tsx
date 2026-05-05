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
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
}

export default function Hero({ onOpenApp }: { onOpenApp: () => void }) {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 md:px-12">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-1/2 left-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-[350px] w-[350px] rounded-full bg-teal/10 blur-[100px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            'linear-gradient(rgba(123,92,245,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(123,92,245,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >
          <motion.div variants={itemVariants} className="mb-7">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-violet/25 bg-violet/8 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-widest text-violet">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft 
                 shadow-[0_0_6px_2px_rgba(52,211,153,0.7)] 
                " />
              AI Voice Assistant
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-6 font-display text-primary font-extrabold leading-[1.03] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 6.5vw, 5.5rem)' }}
          >
            Speak.&nbsp;
            <span className="text-primary">
              <FlipText
                words={['Think.', 'Learn.', 'Reply.', 'Grow.']}
                className="text-gradient-violet"
              />
            </span>
            <br />
            <span className="text-primary">Repeat.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-9 max-w-[480px] font-mono text-[0.82rem] leading-[1.9] text-subtle"
          >
            A seamless voice-first experience. Your words are converted to text,
            processed by AI, and spoken back in natural speech. Hands-free.
            Instant. Intelligent.
          </motion.p>

          <motion.div variants={itemVariants} className="mb-10 flex flex-wrap gap-3">
            <button
              onClick={onOpenApp}
              className="inline-flex items-center gap-2 rounded-lg border-0 bg-violet px-6 py-3 font-mono text-[0.78rem] font-bold uppercase tracking-widest text-white transition-all duration-200 hover:bg-violet-light hover:shadow-glow-violet"
            >
              Open App <ArrowRight size={15} />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-border-bright bg-transparent px-6 py-3 font-mono text-[0.78rem] uppercase tracking-widest text-subtle transition-all duration-200 hover:border-violet/50 hover:text-primary"
            >
              How It Works
            </a>
          </motion.div>

          {/* <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex min-w-[90px] flex-col rounded-xl border border-border bg-card px-5 py-3 shadow-card">
                <span className="mb-1 font-display text-2xl font-extrabold leading-none text-violet-light">{stat.num}</span>
                <span className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">{stat.label}</span>
              </div>
            ))}
          </motion.div> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          <VoiceOrb state="idle" />
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2" aria-hidden>
        <div className="h-14 w-px origin-top animate-scroll-drop bg-gradient-to-b from-violet to-transparent" />
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.25em] text-muted">Scroll</span>
      </div>
    </section>
  )
}
