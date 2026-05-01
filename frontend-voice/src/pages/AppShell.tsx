import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/sidebar/Sidebar'
import ChatPage from './ChatPage'
import VoicePage from './VoicePage'
import { useConversationStore } from '../store/conversationStore'

export default function AppShell() {
  const { activeId, createConversation, getConversation, setActiveId } = useConversationStore()
  const [mode, setMode] = useState<'chat' | 'voice'>('chat')

  useEffect(() => {
    if (!activeId) {
      createConversation('chat')
    } else {
      const conversation = getConversation(activeId)
      if (conversation) setMode(conversation.mode)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNavigate = (nextMode: 'chat' | 'voice', id: string) => {
    setActiveId(id)
    setMode(nextMode)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas theme-transition">
      <Sidebar onNavigate={handleNavigate} />

      <main className="relative flex min-w-0 flex-1 overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 z-0 h-32"
          style={{
            background: 'linear-gradient(to bottom, rgb(var(--color-violet) / 0.1), transparent)',
          }}
          aria-hidden
        />

        {activeId ? (
          <motion.div
            key={`${activeId}-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex h-full w-full flex-col"
          >
            {mode === 'voice' ? (
              <VoicePage conversationId={activeId} onSwitchMode={setMode} />
            ) : (
              <ChatPage conversationId={activeId} onSwitchMode={setMode} />
            )}
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
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-3xl shadow-card">
        🎙️
      </div>
      <div>
        <h2 className="mb-2 font-display text-2xl font-bold text-primary">Welcome to Weblyrix</h2>
        <p className="max-w-xs font-mono text-[0.72rem] text-muted">
          Start a new chat or voice session from the sidebar.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => createConversation('chat')}
          className="rounded-xl bg-violet px-6 py-2.5 font-mono text-[0.72rem] tracking-wide text-white transition-colors hover:bg-violet-light"
        >
          New Chat
        </button>
        <button
          onClick={() => createConversation('voice')}
          className="rounded-xl border border-border bg-surface px-6 py-2.5 font-mono text-[0.72rem] tracking-wide text-primary transition-colors hover:bg-card"
        >
          New Voice
        </button>
      </div>
    </div>
  )
}
