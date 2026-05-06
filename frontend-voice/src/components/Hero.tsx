import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import VoiceOrb from './VoiceOrb'
import FlipText from './FlipText'
import type { Theme } from '../hooks/useTheme'

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
}

export default function Hero({ onOpenApp, theme }: { onOpenApp: () => void; theme: Theme }) {
  const heroGradientClass = theme === 'dark' ? 'text-gradient-violet' : 'text-gradient-ink'

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-start overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 md:px-12 md:pb-24 lg:justify-center"
    >
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

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:gap-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex min-w-0 flex-col"
        >
          <motion.div variants={itemVariants} className="mb-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet/25 bg-violet/8 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-violet sm:gap-2.5 sm:px-4 sm:py-2 sm:text-[0.68rem] sm:tracking-widest">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft 
                 shadow-[0_0_6px_2px_rgba(52,211,153,0.7)] 
                " />
              AI Voice Assistant
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-5 font-display font-extrabold leading-[0.94] tracking-tight text-primary sm:mb-6 sm:leading-[0.98] md:leading-[1.02]"
            style={{ fontSize: 'clamp(2.35rem, 14vw, 5.5rem)' }}
          >
            <span className="block md:inline">Speak.</span>
            <span className="block text-primary md:ml-[0.16em] md:inline">
              <FlipText
                words={['Think.', 'Learn.', 'Reply.', 'Grow.']}
                className={heroGradientClass}
                minWidth="6ch"
              />
            </span>
            <span className="block text-primary">Repeat.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-8 max-w-[32rem] font-mono text-[0.76rem] leading-[1.8] text-subtle sm:mb-9 sm:text-[0.82rem] sm:leading-[1.9]"
          >
            A seamless voice-first experience. Your words are converted to text,
            processed by AI, and spoken back in natural speech. Hands-free.
            Instant. Intelligent.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mb-6 flex w-full max-w-[18rem] flex-col gap-3 sm:mb-10 sm:max-w-none sm:flex-row sm:flex-wrap"
          >
            <button
              onClick={onOpenApp}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-0 bg-violet px-6 py-3 font-mono text-[0.74rem] font-bold uppercase tracking-widest text-white transition-all duration-200 hover:bg-violet-light hover:shadow-glow-violet sm:w-auto sm:text-[0.78rem]"
            >
              Open App <ArrowRight size={15} />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border-bright bg-transparent px-6 py-3 font-mono text-[0.74rem] uppercase tracking-widest text-subtle transition-all duration-200 hover:border-violet/50 hover:text-primary sm:w-auto sm:text-[0.78rem]"
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
          className="order-last flex min-w-0 items-center justify-center pt-2 sm:pt-4 lg:justify-end sm:flex-col sm:my-20"
        >
          <VoiceOrb state="idle" size="hero" />
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex" aria-hidden>
        <div className="h-14 w-px origin-top animate-scroll-drop bg-gradient-to-b from-violet to-transparent" />
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.25em] text-muted">Scroll</span>
      </div>
    </section>
  )
}
