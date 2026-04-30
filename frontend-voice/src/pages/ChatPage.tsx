import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import MessageBubble from '../components/chat/MessageBubble'
import ChatInput from '../components/chat/ChatInput'
import ChatHeader from '../components/chat/ChatHeader'
import { useConversationStore } from '../store/conversationStore'
import { useVoicePipeline } from '../hooks/useVoicePipeline'
import { sendChatMessage } from '../lib/api'

const DEMO = [
  "Hi! I'm Weblyrix AI. Ask me anything or switch to Voice mode for hands-free interaction.",
  "The pipeline: Whisper transcribes your speech → GPT generates a reply → ElevenLabs speaks it back.",
  "I support 99+ languages. Just speak and Whisper will handle the rest.",
  "Connect your API keys in the backend .env to activate real AI responses.",
  "You can export your conversation history or clear it using the sidebar controls.",
]
let di = 0

interface Props { conversationId: string; onSwitchMode: (m: 'chat' | 'voice') => void }

export default function ChatPage({ conversationId, onSwitchMode }: Props) {
  const { getConversation, addMessage, updateMessage, deleteConversation } = useConversationStore()
  const conv     = getConversation(conversationId)
  const messages = conv?.messages ?? []
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { recordingState, startListening, stopListening } = useVoicePipeline(conversationId)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])

  const handleSend = useCallback(async (text: string) => {
    if (loading) return
    setLoading(true)
    addMessage(conversationId, { role: 'user', content: text })
    const holder = addMessage(conversationId, { role: 'assistant', content: '', isLoading: true })
    try {
      const history = [...(conv?.messages ?? []), { role: 'user' as const, content: text }]
        .map(m => ({ role: m.role, content: m.content }))
      let reply: string
      try { reply = await sendChatMessage(history) }
      catch { reply = DEMO[di++ % DEMO.length] }
      const fresh = useConversationStore.getState().getConversation(conversationId)
      const lm    = fresh?.messages.findLast(m => m.isLoading)
      if (lm) updateMessage(conversationId, lm.id, { content: reply, isLoading: false })
      else    updateMessage(conversationId, holder.id, { content: reply, isLoading: false })
    } finally { setLoading(false) }
  }, [conversationId, conv, addMessage, updateMessage, loading])

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        conversationId={conversationId}
        mode="chat"
        onSwitchMode={onSwitchMode}
        onDelete={() => deleteConversation(conversationId)}
      />
      <div className="flex-1 overflow-y-auto py-4" style={{ scrollbarWidth: 'none' }}>
        {messages.length === 0 ? (
          <EmptyState onSend={handleSend} />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map(m => <MessageBubble key={m.id} message={m} />)}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>
      <ChatInput
        onSend={handleSend}
        onVoiceStart={startListening}
        onVoiceStop={stopListening}
        isRecording={recordingState === 'recording'}
        isLoading={loading || recordingState === 'processing'}
        disabled={recordingState === 'speaking'}
      />
    </div>
  )
}

function EmptyState({ onSend }: { onSend: (t: string) => void }) {
  const CHIPS = ['What can you do?', 'How does voice work?', 'Supported languages?', 'Tell me about the stack.']
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full gap-8 px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-2xl">🎙️</div>
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">How can I help?</h2>
          <p className="font-mono text-[0.72rem] text-white/35 max-w-xs">Ask anything, or switch to Voice for hands-free AI conversation.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 max-w-sm w-full">
        {CHIPS.map(c => (
          <motion.button key={c} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => onSend(c)}
            className="flex items-start gap-2 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-2xl px-4 py-3 text-left transition-all">
            <Sparkles size={12} className="text-white/40 flex-shrink-0 mt-0.5" />
            <span className="font-mono text-[0.68rem] text-white/50 leading-relaxed">{c}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
