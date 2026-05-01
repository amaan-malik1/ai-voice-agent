import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import ChatHeader from '../components/chat/ChatHeader'
import ChatInput from '../components/chat/ChatInput'
import MessageBubble from '../components/chat/MessageBubble'
import { useVoicePipeline } from '../hooks/useVoicePipeline'
import { sendChatMessage } from '../lib/api'
import { useConversationStore } from '../store/conversationStore'

const DEMO = [
  "Hi! I'm Weblyrix AI. Ask me anything or switch to Voice mode for hands-free interaction.",
  'The pipeline: Whisper transcribes your speech, GPT generates a reply, and ElevenLabs speaks it back.',
  'I support 99+ languages. Just speak and Whisper will handle the rest.',
  'Connect your API keys in the backend .env to activate real AI responses.',
  'You can export your conversation history or clear it using the sidebar controls.',
]

let demoIndex = 0

interface Props {
  conversationId: string
  onSwitchMode: (mode: 'chat' | 'voice') => void
}

export default function ChatPage({ conversationId, onSwitchMode }: Props) {
  const { getConversation, addMessage, updateMessage, deleteConversation } = useConversationStore()
  const conversation = getConversation(conversationId)
  const messages = conversation?.messages ?? []
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { recordingState, startListening, stopListening } = useVoicePipeline(conversationId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = useCallback(async (text: string) => {
    if (loading) return

    setLoading(true)
    addMessage(conversationId, { role: 'user', content: text })
    const holder = addMessage(conversationId, { role: 'assistant', content: '', isLoading: true })

    try {
      const history = [...(conversation?.messages ?? []), { role: 'user' as const, content: text }]
        .map((message) => ({ role: message.role, content: message.content }))

      let reply: string

      try {
        reply = await sendChatMessage(history)
      } catch {
        reply = DEMO[demoIndex++ % DEMO.length]
      }

      const freshConversation = useConversationStore.getState().getConversation(conversationId)
      const lastLoadingMessage = freshConversation?.messages.findLast((message) => message.isLoading)

      if (lastLoadingMessage) {
        updateMessage(conversationId, lastLoadingMessage.id, { content: reply, isLoading: false })
      } else {
        updateMessage(conversationId, holder.id, { content: reply, isLoading: false })
      }
    } finally {
      setLoading(false)
    }
  }, [conversation, conversationId, addMessage, updateMessage, loading])

  return (
    <div className="flex h-full flex-col">
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
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
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

function EmptyState({ onSend }: { onSend: (text: string) => void }) {
  const chips = ['What can you do?', 'How does voice work?', 'Supported languages?', 'Tell me about the stack.']

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col items-center justify-center gap-8 px-6"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-2xl shadow-card">
          🎙️
        </div>
        <div>
          <h2 className="mb-2 font-display text-2xl font-bold text-primary">How can I help?</h2>
          <p className="max-w-xs font-mono text-[0.72rem] text-muted">
            Ask anything, or switch to Voice for hands-free AI conversation.
          </p>
        </div>
      </div>
      <div className="grid w-full max-w-sm grid-cols-2 gap-2">
        {chips.map((chip) => (
          <motion.button
            key={chip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSend(chip)}
            className="flex items-start gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-all hover:border-border-bright hover:bg-surface"
          >
            <Sparkles size={12} className="mt-0.5 flex-shrink-0 text-violet" />
            <span className="font-mono text-[0.68rem] leading-relaxed text-subtle">{chip}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
