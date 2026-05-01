import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Bot, User, X } from 'lucide-react'
import ChatHeader from '../components/chat/ChatHeader'
import VoiceOrb from '../components/voice/VoiceOrb'
import WaveformVisualizer from '../components/voice/WaveformVisualizer'
import { useVoicePipeline } from '../hooks/useVoicePipeline'
import { cn, formatTime } from '../lib/utils'
import { useConversationStore } from '../store/conversationStore'

interface Props {
  conversationId: string
  onSwitchMode: (mode: 'chat' | 'voice') => void
}

export default function VoicePage({ conversationId, onSwitchMode }: Props) {
  const { getConversation, deleteConversation } = useConversationStore()
  const conversation = getConversation(conversationId)
  const messages = conversation?.messages ?? []
  const { recordingState, audioLevel, error, startListening, stopListening, clearError } = useVoicePipeline(conversationId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.target !== document.body) return

      if (recordingState === 'idle') {
        event.preventDefault()
        startListening()
      } else if (recordingState === 'recording') {
        event.preventDefault()
        stopListening()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [recordingState, startListening, stopListening])

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgb(var(--color-violet) / 0.12) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <ChatHeader
        conversationId={conversationId}
        mode="voice"
        onSwitchMode={onSwitchMode}
        onDelete={() => deleteConversation(conversationId)}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-4 mt-3 flex flex-shrink-0 items-center gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-2.5"
          >
            <AlertCircle size={13} className="flex-shrink-0 text-red-400" />
            <span className="flex-1 font-mono text-[0.7rem] text-red-300">{error}</span>
            <button onClick={clearError} className="text-red-400/70 hover:text-red-400">
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="flex flex-col items-center justify-center gap-8 border-b border-border p-8 lg:w-[45%] lg:border-r lg:border-b-0">
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

          <div className="flex items-center gap-3">
            <kbd className="rounded border border-border bg-card px-2 py-1 font-mono text-[0.58rem] text-muted shadow-card">
              Space
            </kbd>
            <span className="font-mono text-[0.58rem] text-muted">toggle mic</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden lg:w-[55%]">
          <div className="border-b border-border px-4 py-3">
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
              Transcript / {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" style={{ scrollbarWidth: 'none' }}>
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
                  <span className="text-lg">🎙️</span>
                </div>
                <p className="font-mono text-[0.65rem] text-muted">
                  Transcript will appear
                  <br />
                  here as you speak...
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: message.role === 'user' ? 16 : -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={cn('flex gap-2.5', message.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                  >
                    <div
                      className={cn(
                        'mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-xl border',
                        message.role === 'user'
                          ? 'border-border-bright bg-primary text-canvas'
                          : 'border-border bg-card text-subtle',
                      )}
                    >
                      {message.role === 'user' ? <User size={11} /> : <Bot size={11} />}
                    </div>

                    <div className={cn('flex max-w-[85%] flex-col gap-1', message.role === 'user' ? 'items-end' : 'items-start')}>
                      <div
                        className={cn(
                          'rounded-xl border px-3 py-2.5 font-mono text-[0.72rem] leading-[1.75]',
                          message.role === 'user'
                            ? 'rounded-tr-sm border-border-bright bg-primary text-canvas'
                            : 'rounded-tl-sm border-border bg-surface text-subtle',
                        )}
                      >
                        {message.isLoading ? (
                          <div className="flex gap-1.5 py-0.5">
                            {[0, 1, 2].map((index) => (
                              <motion.span
                                key={index}
                                className="h-1.5 w-1.5 rounded-full bg-muted"
                                animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 0.9, delay: index * 0.2 }}
                              />
                            ))}
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                      <span className="px-1 font-mono text-[0.55rem] text-muted">
                        {formatTime(new Date(message.timestamp))}
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
