import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, Trash2 } from 'lucide-react'
import { cn } from '../lib/utils'
import VoiceOrb from './VoiceOrb'
import SectionHeader from './SectionHeader'
import type { RecordingState } from '../types'

interface DemoMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: Date
}

const DEMO_RESPONSES = [
  "Hello! I'm Weblyrix, your AI voice assistant. I heard you clearly. How can I help you today?",
  'Great question! I process your speech using OpenAI Whisper for transcription, then generate this response via LLaMA 3 or GPT. The pipeline is seamless.',
  'I run on a React + TypeScript frontend with a Node.js or FastAPI backend. Whisper handles speech recognition across 99+ languages, and ElevenLabs powers my natural voice.',
  "Absolutely. Whisper's multilingual model lets you speak in any language and receive accurate transcriptions. TTS APIs support multiple regional voices too.",
  'Typically under one second from when you finish speaking to when you hear my reply. The full STT to AI to TTS pipeline is highly optimized.',
]

let responseIdx = 0
const genId = () => Math.random().toString(36).slice(2)

export default function VoiceDemo() {
  const [state, setState] = useState<RecordingState>('idle')
  const [messages, setMessages] = useState<DemoMessage[]>([])
  const [inputText, setInputText] = useState('')
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  const addMsg = (role: DemoMessage['role'], text: string) => {
    setMessages((prev) => [...prev, { id: genId(), role, text, timestamp: new Date() }])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }

  const simulateReply = () => {
    setState('processing')
    setTimeout(() => {
      addMsg('assistant', DEMO_RESPONSES[responseIdx++ % DEMO_RESPONSES.length])
      setState('speaking')
      setTimeout(() => setState('idle'), 2000)
    }, 1000)
  }

  const startRecording = useCallback(async () => {
    if (state !== 'idle') return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      mediaRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        addMsg('user', 'How do you work exactly?')
        simulateReply()
      }
      recorder.start()
      setState('recording')
    } catch {
      alert('Please allow microphone access to use voice input.')
    }
  }, [state])

  const stopRecording = useCallback(() => {
    if (mediaRef.current && state === 'recording') mediaRef.current.stop()
  }, [state])

  const handleOrbClick = () => {
    if (state === 'idle') startRecording()
    else if (state === 'recording') stopRecording()
  }

  const handleSend = () => {
    const text = inputText.trim()
    if (!text || state !== 'idle') return
    setInputText('')
    addMsg('user', text)
    simulateReply()
  }

  return (
    <section id="demo" className="border-t border-border bg-surface/30 px-6 py-28 md:px-12 theme-transition">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          tag="Live Demo"
          title={<>Talk to the<br /><span className="text-subtle">assistant.</span></>}
          subtitle="Click the orb to start recording. The demo simulates the full STT to AI to TTS pipeline with realistic responses."
        />

        <div className="grid items-start gap-8 md:grid-cols-2">
          <div className="flex justify-center">
            <VoiceOrb state={state} onClick={handleOrbClick} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[480px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card theme-transition"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" />
                <span className="font-mono text-[0.7rem] uppercase tracking-widest text-subtle">Conversation</span>
              </div>
              <button
                onClick={() => setMessages([])}
                className="text-muted transition-colors hover:text-subtle"
                aria-label="Clear conversation"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="flex max-h-72 min-h-[240px] flex-1 flex-col gap-3 overflow-y-auto p-5">
              {messages.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 opacity-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border">
                    <span className="text-xl">🎙️</span>
                  </div>
                  <p className="font-mono text-[0.7rem] text-muted">Click the orb or type to start</p>
                </div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={cn(
                      'flex max-w-[85%] flex-col gap-1',
                      message.role === 'user' ? 'self-end items-end' : 'self-start items-start',
                    )}
                  >
                    <span className="font-mono text-[0.58rem] uppercase tracking-widest text-muted">
                      {message.role === 'user' ? 'You' : 'Weblyrix AI'}
                    </span>
                    <div
                      className={cn(
                        'rounded-2xl border px-4 py-3 font-mono text-[0.75rem] leading-[1.75]',
                        message.role === 'user'
                          ? 'border-border-bright bg-primary text-canvas'
                          : 'border-border bg-surface text-subtle',
                      )}
                    >
                      {message.text}
                    </div>
                    <span className="font-mono text-[0.58rem] text-muted">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-3 border-t border-border p-4">
              <input
                type="text"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSend()}
                disabled={state !== 'idle'}
                placeholder="Or type a message..."
                className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 font-mono text-[0.75rem] text-primary outline-none transition-colors placeholder:text-muted focus:border-violet/50 disabled:cursor-not-allowed disabled:opacity-40"
              />
              <button
                onClick={handleSend}
                disabled={state !== 'idle' || !inputText.trim()}
           
                className="rounded-xl bg-violet px-4 py-2.5 text-white transition-all duration-200 hover:bg-violet-light hover:shadow-glow-violet disabled:cursor-not-allowed disabled:opacity-35"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
