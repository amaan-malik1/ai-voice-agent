import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { cn } from '../lib/utils'
import type { FeatureItem } from '../types'

const FEATURES: FeatureItem[] = [
  { id: 'f1', icon: '🎙️', title: 'One-Click Voice Input', description: 'Real-time audio capture via MediaRecorder API. Supports WAV, MP3, and WebM. Voice Activity Detection auto-stops when you stop talking.', badge: 'Core' },
  { id: 'f2', icon: '🧠', title: 'Context-Aware AI', description: 'Full conversation history maintained across turns. The AI understands context, remembers prior messages, and generates intelligent, relevant replies.', badge: 'Core' },
  { id: 'f3', icon: '🔊', title: 'Natural Voice Output', description: 'ElevenLabs TTS converts AI text to lifelike speech. Adjustable speed and pitch. Auto-playback with visible transcript for full accessibility.', badge: 'Core' },
  { id: 'f4', icon: '🌍', title: 'Multilingual Support', description: 'Whisper STT handles 99+ languages with high accuracy. Multi-language TTS support means users can speak and receive responses in any language.', badge: 'Plus' },
  { id: 'f5', icon: '⌨️', title: 'Text Input Fallback', description: "Can't speak right now? Type instead. The same AI pipeline processes text input with identical intelligence. Perfect for noisy environments.", badge: 'Plus' },
  { id: 'f6', icon: '📋', title: 'Conversation Export', description: 'Full chat history with timestamps. Export logs as JSON or plain text for accessibility, record-keeping, analytics, and debugging.', badge: 'Plus' },
]

export default function Features() {
  return (
    <section id="features" className="border-t border-border px-6 py-28 md:px-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          tag="Features"
          title={<>Everything built in.<br /><span className="text-subtle">Nothing held back.</span></>}
          subtitle="Core features ship with every deployment. Plus features are available as extensions."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative cursor-default overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card theme-transition"
              data-cursor="true"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 bg-gradient-violet transition-transform duration-400 group-hover:scale-x-100" />

              <div className="mb-5 flex items-start justify-between">
                <span className="text-3xl leading-none">{feature.icon}</span>
                <span
                  className={cn(
                    'rounded-full border px-3 py-1 font-mono text-[0.58rem] uppercase tracking-widest',
                    feature.badge === 'Core'
                      ? 'border-violet/25 bg-violet/10 text-violet'
                      : 'border-teal/25 bg-teal/10 text-teal',
                  )}
                >
                  {feature.badge}
                </span>
              </div>

              <h3 className="mb-3 font-display text-[1.1rem] font-bold tracking-tight text-primary">{feature.title}</h3>
              <p className="font-mono text-[0.73rem] leading-[1.85] text-subtle">{feature.description}</p>

              <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-violet transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
