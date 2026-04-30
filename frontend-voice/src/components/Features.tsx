import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { cn } from '../lib/utils'
import type { FeatureItem } from '../types'

const FEATURES: FeatureItem[] = [
  { id: 'f1', icon: '🎙️', title: 'One-Click Voice Input', description: 'Real-time audio capture via MediaRecorder API. Supports WAV, MP3, WebM. Voice Activity Detection auto-stops when you stop talking.', badge: 'Core' },
  { id: 'f2', icon: '🧠', title: 'Context-Aware AI', description: 'Full conversation history maintained across turns. The AI understands context, remembers prior messages, and generates intelligent, relevant replies.', badge: 'Core' },
  { id: 'f3', icon: '🔊', title: 'Natural Voice Output', description: 'ElevenLabs TTS converts AI text to lifelike speech. Adjustable speed and pitch. Auto-playback with visible transcript for full accessibility.', badge: 'Core' },
  { id: 'f4', icon: '🌍', title: 'Multilingual Support', description: 'Whisper STT handles 99+ languages with high accuracy. Multi-language TTS support means users can speak and receive responses in any language.', badge: 'Plus' },
  { id: 'f5', icon: '⌨️', title: 'Text Input Fallback', description: "Can't speak right now? Type instead. The same AI pipeline processes text input with identical intelligence. Perfect for noisy environments.", badge: 'Plus' },
  { id: 'f6', icon: '📋', title: 'Conversation Export', description: 'Full chat history with timestamps. Export logs as JSON or plain text — useful for accessibility, record-keeping, analytics, and debugging purposes.', badge: 'Plus' },
]

export default function Features() {
  return (
    <section id="features" className="py-28 px-6 md:px-12 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          tag="Features"
          title={<>Everything built in.<br /><span className=" text-slate-400">Nothing held back.</span></>}
          subtitle="Core features ship with every deployment. Plus features are available as extensions."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-card border border-border rounded-3xl p-7 overflow-hidden group cursor-default shadow-card"
              data-cursor="true"
            >
              {/* Top accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-violet scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

              {/* Card top row */}
              <div className="flex items-start justify-between mb-5">
                <span className="text-3xl leading-none">{feat.icon}</span>
                <span className={cn(
                  'font-mono text-[0.58rem] tracking-widest uppercase px-3 py-1 rounded-full border',
                  feat.badge === 'Core'
                    ? 'text-violet bg-violet/10 border-violet/25'
                    : 'text-teal bg-teal/10 border-teal/25'
                )}>
                  {feat.badge}
                </span>
              </div>

              <h3 className="font-display font-bold text-[1.1rem] mb-3 tracking-tight">{feat.title}</h3>
              <p className="font-mono text-[0.73rem] text-subtle leading-[1.85]">{feat.description}</p>

              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-violet group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
