import { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import ChatPage from './ChatPage'
import VoicePage from './VoicePage'
import { useConversationStore } from '../store/conversationStore'
import { motion } from 'framer-motion'

export default function AppShell() {
  const { activeId, createConversation, getConversation, setActiveId } = useConversationStore()
  const [mode, setMode] = useState<'chat' | 'voice'>('chat')

  // First load — create default conversation
  useEffect(() => {
    if (!activeId) {
      createConversation('chat')
    } else {
      const conv = getConversation(activeId)
      if (conv) setMode(conv.mode)
    }
  }, []) // eslint-disable-line

  const handleNavigate = (m: 'chat' | 'voice', id: string) => {
    setActiveId(id)
    setMode(m)
  }

  const handleSwitchMode = (m: 'chat' | 'voice') => setMode(m)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black">
      <Sidebar onNavigate={handleNavigate} />

      <main className="flex-1 overflow-hidden flex flex-col min-w-0 relative">
        {/* Subtle top gradient — black to slightly lighter */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 z-0"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)' }}
          aria-hidden
        />

        {activeId ? (
          <motion.div
            key={`${activeId}-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full relative z-10"
          >
            {mode === 'voice'
              ? <VoicePage conversationId={activeId} onSwitchMode={handleSwitchMode} />
              : <ChatPage  conversationId={activeId} onSwitchMode={handleSwitchMode} />
            }
          </motion.div>
        ) : (
          <EmptyShell />
        )}
      </main>
    </div>
  )
}

function EmptyShell() {
  const { createConversation } = useConversationStore()
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center p-8 relative z-10">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-3xl">🎙️</div>
      <div>
        <h2 className="font-display font-bold text-2xl text-white mb-2">Welcome to Weblyrix</h2>
        <p className="font-mono text-[0.72rem] text-white/30 max-w-xs">Start a new Chat or Voice session from the sidebar.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => createConversation('chat')}
          className="bg-white text-black font-mono text-[0.72rem] tracking-wide px-6 py-2.5 rounded-xl hover:bg-white/90 transition-colors">
          New Chat
        </button>
        <button onClick={() => createConversation('voice')}
          className="bg-white/5 border border-white/15 text-white font-mono text-[0.72rem] tracking-wide px-6 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
          New Voice
        </button>
      </div>
    </div>
  )
}
