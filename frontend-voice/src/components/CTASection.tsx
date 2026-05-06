import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

export default function CTASection({ onOpenApp }: { onOpenApp: () => void }) {
  return (
    <section className="py-32 px-6 md:px-12 border-t border-border relative overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-violet/8 blur-[120px]" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-violet/10 border border-violet/25 rounded-full px-4 py-2 font-mono text-[0.68rem] tracking-widest uppercase text-violet mb-8">
          <Zap size={12} />
          Ready to Build
        </div>

        <h2
          className="font-display font-extrabold leading-[1.07] tracking-tight mb-6"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
        >
          The future of interaction<br />
          is{' '}
          <span className="text-gradient-violet">voice.</span>
        </h2>

        <p className="font-mono text-[0.8rem] text-subtle leading-[1.9] mb-10">
          Production-ready. Scalable. Customizable for medical, legal,<br />
          education, and enterprise use cases.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onOpenApp}
            className="inline-flex items-center gap-2 bg-violet text-white font-mono font-bold text-[0.8rem] tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-violet-light hover:text-white hover:shadow-glow-violet transition-all duration-200"
          >
            Open Chat <ArrowRight size={16} />
          </button>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 bg-transparent text-subtle font-mono text-[0.8rem] tracking-widest uppercase px-8 py-4 rounded-xl border border-border-bright hover:text-primary hover:border-violet/50 transition-all duration-200"
          >
            Learn More
          </a>
        </div>
      </motion.div>
    </section>
  )
}
