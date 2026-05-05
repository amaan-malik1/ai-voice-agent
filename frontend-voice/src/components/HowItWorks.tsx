import { motion } from 'framer-motion'
import { Mic, FileText, Brain, Volume2, Headphones } from 'lucide-react'
import SectionHeader from './SectionHeader'
import type { StepItem } from '../types';

const STEPS: StepItem[] = [
  { number: '01', icon: '🎤', title: 'User Speaks', description: 'Click the mic button and speak naturally. Audio is captured live via the MediaRecorder API in WAV, MP3, or WebM format.', tag: 'MediaRecorder API' },
  { number: '02', icon: '📝', title: 'Speech → Text', description: 'The audio chunk is sent to the backend, forwarded to OpenAI Whisper, and returned as a high-accuracy text transcript.', tag: 'OpenAI Whisper STT' },
  { number: '03', icon: '🧠', title: 'AI Processes', description: 'The transcript is passed to LLaMA 3 or GPT. The model understands full conversation context and generates an intelligent reply.', tag: 'LLaMA 3 / GPT API' },
  { number: '04', icon: '🔊', title: 'Text → Voice', description: 'The AI response is sent to a TTS API — ElevenLabs, Google TTS, or Azure — which returns a natural-sounding MP3 audio stream.', tag: 'ElevenLabs TTS' },
  { number: '05', icon: '▶️', title: 'You Hear It', description: 'The frontend receives the audio blob and auto-plays it. A text transcript is shown on screen for full accessibility.', tag: 'HTML5 Audio API' },
]

const ICONS = [Mic, FileText, Brain, Volume2, Headphones]

export default function HowItWorks() {
  // useGSAP(() => {
  //   const titleSplit = new SplitText('.itle', {
  //     type: 'chars, words'
  //   })

  //   titleSplit.chars.forEach((char) => char.classList.add('text-gradient'))

  //   gsap.from(titleSplit.chars, {
  //     yPercent: 100,
  //     duration: 2,
  //     ease: 'expo.out',
  //     stagger: 0.06
  //   })

  //   gsap.timeline({
  //     scrollTrigger: {
  //       trigger: '#how-it-works',
  //       start: 'top top',
  //       end: 'bottom top',
  //       scrub: true,
  //     }
  //   })
  // }, [])
  return (
    <section id="how-it-works" className="py-28 px-6 md:px-12 border-t border-border">
      <div className="title max-w-4xl mx-auto">
        <SectionHeader
          tag="How It Works"
          title={<>From your voice to<br /><span className="text-gradient-violet">AI's reply</span> — in seconds.</>}
          subtitle="A five-step pipeline connects your microphone to an intelligent voice response, seamlessly orchestrated on the backend."
        />

        <div className="relative flex flex-col gap-0">
          {/* Vertical connector line */}
          <div className="absolute left-[27px] top-14 bottom-14 w-px bg-gradient-to-b from-transparent via-violet/30 to-transparent" aria-hidden />

          {STEPS.map((step, i) => {
            const Icon = ICONS[i]
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-6 p-6 rounded-2xl hover:bg-card/60 transition-colors duration-300 group cursor-default"
                
              >
                {/* Number circle */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-violet group-hover:border-violet transition-all duration-300">
                  <Icon size={20} className="text-violet group-hover:text-white transition-colors duration-300" />
                </div>

                <div className="pt-1">
                  <div className="font-mono text-[0.62rem] tracking-widest uppercase text-muted mb-1.5">{step.number} · {step.tag}</div>
                  <h3 className="font-display font-bold text-xl mb-2 tracking-tight">{step.title}</h3>
                  <p className="font-mono text-[0.75rem] text-subtle leading-[1.85]">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
