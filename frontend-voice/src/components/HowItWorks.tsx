import { motion } from 'framer-motion'
import { Mic, FileText, Brain, Volume2, Headphones } from 'lucide-react'
import SectionHeader from './SectionHeader'
import type { Theme } from '../hooks/useTheme'
import type { StepItem } from '../types'

const STEPS: StepItem[] = [
  {
    number: '01',
    icon: 'mic',
    title: 'User Speaks',
    description:
      'Click the mic button and speak naturally. Audio is captured live via the MediaRecorder API in WAV, MP3, or WebM format.',
    tag: 'MediaRecorder API',
  },
  {
    number: '02',
    icon: 'text',
    title: 'Speech -> Text',
    description:
      'The audio chunk is sent to the backend, forwarded to OpenAI Whisper, and returned as a high-accuracy text transcript.',
    tag: 'OpenAI Whisper STT',
  },
  {
    number: '03',
    icon: 'brain',
    title: 'AI Processes',
    description:
      'The transcript is passed to LLaMA 3 or GPT. The model understands full conversation context and generates an intelligent reply.',
    tag: 'LLaMA 3 / GPT API',
  },
  {
    number: '04',
    icon: 'volume',
    title: 'Text -> Voice',
    description:
      'The AI response is sent to a TTS API such as ElevenLabs, Google TTS, or Azure, which returns a natural-sounding MP3 audio stream.',
    tag: 'ElevenLabs TTS',
  },
  {
    number: '05',
    icon: 'play',
    title: 'You Hear It',
    description:
      'The frontend receives the audio blob and auto-plays it. A text transcript is shown on screen for full accessibility.',
    tag: 'HTML5 Audio API',
  },
]

const ICONS = [Mic, FileText, Brain, Volume2, Headphones]

interface HowItWorksProps {
  theme: Theme
}

export default function HowItWorks({ theme }: HowItWorksProps) {
  const replyGradientClass = theme === 'dark' ? 'text-gradient-violet' : 'text-gradient-ink'

  return (
    <section id="how-it-works" className="border-t border-border px-6 py-28 md:px-12">
      <div className="title mx-auto max-w-4xl">
        <SectionHeader
          tag="How It Works"
          title={
            <>
              From your voice to
              <br />
              <span className={replyGradientClass}>AI&apos;s reply</span>
              {' '}
              &mdash; in seconds.
            </>
          }
          subtitle="A five-step pipeline connects your microphone to an intelligent voice response, seamlessly orchestrated on the backend."
        />

        <div className="relative flex flex-col gap-0">
          <div
            className="absolute bottom-14 left-[27px] top-14 w-px bg-gradient-to-b from-transparent via-violet/30 to-transparent"
            aria-hidden
          />

          {STEPS.map((step, i) => {
            const Icon = ICONS[i]

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group flex cursor-default gap-6 rounded-2xl p-6 transition-colors duration-300 hover:bg-card/60"
              >
                <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-border bg-surface transition-all duration-300 group-hover:border-violet group-hover:bg-violet">
                  <Icon size={20} className="text-violet transition-colors duration-300 group-hover:text-white" />
                </div>

                <div className="pt-1">
                  <div className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                    {step.number} · {step.tag}
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold tracking-tight">{step.title}</h3>
                  <p className="font-mono text-[0.75rem] leading-[1.85] text-subtle">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
