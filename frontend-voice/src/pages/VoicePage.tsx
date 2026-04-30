import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, User, X, AlertCircle } from 'lucide-react'
import VoiceOrb from '../components/voice/VoiceOrb'
import WaveformVisualizer from '../components/voice/WaveformVisualizer'
import ChatHeader from '../components/chat/ChatHeader'
import { useConversationStore } from '../store/conversationStore'
import { useVoicePipeline } from '../hooks/useVoicePipeline'
import { cn, formatTime } from '../lib/utils'

interface Props { conversationId: string; onSwitchMode: (m: 'chat' | 'voice') => void }

export default function VoicePage({ conversationId, onSwitchMode }: Props) {
  const { getConversation, deleteConversation } = useConversationStore()
  const conv     = getConversation(conversationId)
  const messages = conv?.messages ?? []
  const { recordingState, audioLevel, error, startListening, stopListening, clearError } = useVoicePipeline(conversationId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])

  // Spacebar shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.target !== document.body) return
      if (recordingState === 'idle') { e.preventDefault(); startListening() }
      else if (recordingState === 'recording') { e.preventDefault(); stopListening() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [recordingState, startListening, stopListening])

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Subtle radial bg — black only */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(255,255,255,0.04) 0%, transparent 70%)' }}
        aria-hidden
      />

      <ChatHeader
        conversationId={conversationId}
        mode="voice"
        onSwitchMode={onSwitchMode}
        onDelete={() => deleteConversation(conversationId)}
      />

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-4 mt-3 flex items-center gap-2 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-2.5 flex-shrink-0">
            <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
            <span className="font-mono text-[0.7rem] text-red-300 flex-1">{error}</span>
            <button onClick={clearError} className="text-red-400/60 hover:text-red-400"><X size={13} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout: orb left | transcript right */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative z-10">

        {/* LEFT — Orb + waveform */}
        <div className="flex flex-col items-center justify-center gap-8 lg:w-[45%] p-8 border-b lg:border-b-0 lg:border-r border-white/10">
          <VoiceOrb
            state={recordingState}
            audioLevel={audioLevel}
            onStart={startListening}
            onStop={stopListening}
          />

          <WaveformVisualizer
            audioLevel={audioLevel}
            isActive={recordingState === 'recording' || recordingState === 'speaking'}
          />

          {/* Keyboard hint */}
          <div className="flex items-center gap-3">
            <kbd className="font-mono text-[0.58rem] bg-white/5 border border-white/10 rounded px-2 py-1 text-white/30">Space</kbd>
            <span className="font-mono text-[0.58rem] text-white/25">toggle mic</span>
          </div>
        </div>

        {/* RIGHT — Transcript panel */}
        <div className="flex flex-col flex-1 overflow-hidden lg:w-[55%]">
          <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
            <p className="font-mono text-[0.62rem] tracking-widest uppercase text-white/25">
              Transcript · {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: 'none' }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                  <span className="text-lg">🎙️</span>
                </div>
                <p className="font-mono text-[0.65rem] text-white/25">Transcript will appear<br />here as you speak…</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 16 : -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 border',
                      msg.role === 'user' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'
                    )}>
                      {msg.role === 'user' ? <User size={11} className="text-white" /> : <Bot size={11} className="text-white/50" />}
                    </div>

                    <div className={cn('max-w-[85%] flex flex-col gap-1', msg.role === 'user' ? 'items-end' : 'items-start')}>
                      <div className={cn(
                        'px-3 py-2.5 rounded-xl font-mono text-[0.72rem] leading-[1.75] border',
                        msg.role === 'user'
                          ? 'bg-white text-black border-white/20 rounded-tr-sm'
                          : 'bg-white/5 text-white/65 border-white/10 rounded-tl-sm'
                      )}>
                        {msg.isLoading ? (
                          <div className="flex gap-1.5 py-0.5">
                            {[0,1,2].map(i => (
                              <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"
                                animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
                              />
                            ))}
                          </div>
                        ) : msg.content}
                      </div>
                      <span className="font-mono text-[0.55rem] text-white/20 px-1">
                        {formatTime(new Date(msg.timestamp))}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
