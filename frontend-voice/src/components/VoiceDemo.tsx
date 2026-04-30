import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2 } from 'lucide-react'
import VoiceOrb from './VoiceOrb'
import SectionHeader from './SectionHeader'
import type { RecordingState } from '../types'

interface DemoMessage { id: string; role: 'user' | 'assistant'; text: string; timestamp: Date }
import { cn } from '../lib/utils'

const DEMO_RESPONSES = [
  "Hello! I'm Weblyrix, your AI voice assistant. I heard you clearly. How can I help you today?",
  "Great question! I process your speech using OpenAI Whisper for transcription, then generate this response via LLaMA 3 or GPT. The pipeline is seamless!",
  "I run on a React + TypeScript frontend with a Node.js/FastAPI backend. Whisper handles speech recognition across 99+ languages, and ElevenLabs powers my natural voice.",
  "Absolutely! Whisper's multilingual model lets you speak in any language and receive accurate transcriptions. TTS APIs support multiple regional voices too.",
  "Typically under one second from when you finish speaking to when you hear my reply — the full STT → AI → TTS pipeline is highly optimized.",
]

let responseIdx = 0
const genId = () => Math.random().toString(36).slice(2)

export default function VoiceDemo() {
  const [state, setState]       = useState<RecordingState>('idle')
  const [messages, setMessages] = useState<DemoMessage[]>([])
  const [inputText, setInputText] = useState('')
  const mediaRef  = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  const addMsg = (role: DemoMessage['role'], text: string) => {
    setMessages(prev => [...prev, { id: genId(), role, text, timestamp: new Date() }])
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
      const mr = new MediaRecorder(stream)
      mediaRef.current = mr
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        addMsg('user', 'How do you work exactly?')
        simulateReply()
      }
      mr.start()
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
    <section id="demo" className="py-28 px-6 md:px-12 border-t border-border bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          tag="Live Demo"
          title={<>Talk to the<br /><span className="text-gray-400">assistant.</span></>}
          subtitle="Click the orb to start recording. The demo simulates the full STT → AI → TTS pipeline with realistic responses."
        />

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Orb side */}
          <div className="flex justify-center">
            <VoiceOrb state={state} onClick={handleOrbClick} />
          </div>

          {/* Chat panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col min-h-[480px] shadow-card"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
                <span className="font-mono text-[0.7rem] tracking-widest uppercase text-subtle">Conversation</span>
              </div>
              <button
                onClick={() => setMessages([])}
                data-cursor="true"
                className="text-muted hover:text-subtle transition-colors"
                aria-label="Clear conversation"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 max-h-72 min-h-[240px]">
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-40">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                    <span className="text-xl">🎙️</span>
                  </div>
                  <p className="font-mono text-[0.7rem] text-muted">Click the orb or type to start</p>
                </div>
              )}

              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0,  scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={cn(
                      'flex flex-col gap-1 max-w-[85%]',
                      msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                    )}
                  >
                    <span className="font-mono text-[0.58rem] tracking-widest uppercase text-muted">
                      {msg.role === 'user' ? 'You' : 'Weblyrix AI'}
                    </span>
                    <div className={cn(
                      'font-mono text-[0.75rem] leading-[1.75] px-4 py-3 rounded-2xl border',
                      msg.role === 'user'
                        ? 'bg-violet/12 border-violet/30 text-primary'
                        : 'bg-surface border-border text-subtle'
                    )}>
                      {msg.text}
                    </div>
                    <span className="font-mono text-[0.58rem] text-muted">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={state !== 'idle'}
                placeholder="Or type a message…"
                className="flex-1 bg-surface border border-border rounded-xl font-mono text-[0.75rem] text-primary placeholder:text-muted px-4 py-2.5 outline-none focus:border-violet/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={state !== 'idle' || !inputText.trim()}
                data-cursor="true"
                className="bg-violet text-white rounded-xl px-4 py-2.5 hover:bg-violet-light hover:shadow-glow-violet transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed"
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
