import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, MessageSquare, Mic, Plus, Search, Trash2 } from 'lucide-react'
import { cn, formatDate, truncate } from '../../lib/utils'
import { useConversationStore } from '../../store/conversationStore'
import type { Conversation } from '../../types'

interface Props {
  onNavigate: (mode: 'chat' | 'voice', id: string) => void
}

export default function Sidebar({ onNavigate }: Props) {
  const {
    conversations,
    activeId,
    sidebarOpen,
    toggleSidebar,
    createConversation,
    deleteConversation,
    setActiveId,
    clearAll,
  } = useConversationStore()

  const [search, setSearch] = useState('')
  const [hovered, setHovered] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const filtered = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(search.toLowerCase()),
  )

  const grouped = filtered.reduce<Record<string, Conversation[]>>((acc, conversation) => {
    const label = formatDate(new Date(conversation.updatedAt))
    acc[label] = [...(acc[label] ?? []), conversation]
    return acc
  }, {})

  const handleNew = (mode: 'chat' | 'voice') => {
    const conversation = createConversation(mode)
    onNavigate(mode, conversation.id)
  }

  const handleSelect = (conversation: Conversation) => {
    setActiveId(conversation.id)
    onNavigate(conversation.mode, conversation.id)
  }

  if (!sidebarOpen) {
    return (
      <div className="flex h-full w-14 flex-shrink-0 flex-col items-center gap-3 border-r border-border bg-surface py-4 px-2 theme-transition">
        <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-violet font-mono text-xs font-bold text-white shadow-glow-violet">
          W
        </div>
        <button onClick={toggleSidebar} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-card hover:text-primary">
          <ChevronRight size={15} />
        </button>
        <button onClick={() => handleNew('chat')} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-card hover:text-primary">
          <MessageSquare size={15} />
        </button>
        <button onClick={() => handleNew('voice')} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-card hover:text-primary">
          <Mic size={15} />
        </button>
      </div>
    )
  }

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 272, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-shrink-0 flex-col overflow-hidden border-r border-border bg-surface theme-transition"
      style={{ minWidth: 0 }}
    >
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet font-mono text-xs font-bold text-white shadow-glow-violet">
            W
          </div>
          <span className="font-display text-sm font-bold uppercase tracking-widest text-primary">Weblyrix</span>
        </div>
        <button onClick={toggleSidebar} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-card hover:text-primary">
          <ChevronLeft size={14} />
        </button>
      </div>

      <div className="flex flex-shrink-0 gap-2 border-b border-border px-3 py-3">
        <button onClick={() => handleNew('chat')} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 font-mono text-[0.68rem] tracking-wide text-primary transition-all hover:border-border-bright hover:bg-surface">
          <Plus size={12} /> Chat
        </button>
        <button onClick={() => handleNew('voice')} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-violet/25 bg-violet/10 py-2.5 font-mono text-[0.68rem] tracking-wide text-violet transition-all hover:bg-violet/15">
          <Mic size={12} /> Voice
        </button>
      </div>

      <div className="flex-shrink-0 border-b border-border px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <Search size={12} className="flex-shrink-0 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="flex-1 bg-transparent font-mono text-[0.68rem] text-primary placeholder:text-muted outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2" style={{ scrollbarWidth: 'none' }}>
        {Object.keys(grouped).length === 0 && (
          <div className="flex h-32 flex-col items-center justify-center gap-2">
            <Clock size={22} className="text-muted" />
            <p className="text-center font-mono text-[0.62rem] text-muted">{search ? 'No results' : 'No conversations yet'}</p>
          </div>
        )}

        {Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="mb-4">
            <p className="mb-1.5 px-2 font-mono text-[0.58rem] uppercase tracking-widest text-muted">{date}</p>
            {items.map((conversation) => (
              <div
                key={conversation.id}
                onMouseEnter={() => setHovered(conversation.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleSelect(conversation)}
                className={cn(
                  'group mb-0.5 flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all duration-150',
                  activeId === conversation.id
                    ? 'border-border-bright bg-card shadow-card'
                    : 'border-transparent hover:bg-card/70',
                )}
              >
                <div
                  className={cn(
                    'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md',
                    conversation.mode === 'voice' ? 'bg-violet/12 text-violet' : 'bg-card text-subtle',
                  )}
                >
                  {conversation.mode === 'voice' ? <Mic size={10} /> : <MessageSquare size={10} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn('truncate font-mono text-[0.68rem]', activeId === conversation.id ? 'text-primary' : 'text-subtle')}>
                    {truncate(conversation.title, 24)}
                  </p>
                  <p className="font-mono text-[0.56rem] text-muted">
                    {conversation.messages.length} msg{conversation.messages.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <AnimatePresence>
                  {hovered === conversation.id && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.12 }}
                      onClick={(event) => {
                        event.stopPropagation()
                        deleteConversation(conversation.id)
                      }}
                      className="flex h-5 w-5 items-center justify-center rounded text-muted transition-colors hover:text-red-400"
                    >
                      <Trash2 size={11} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 border-t border-border px-3 py-3">
        {confirmClear ? (
          <div className="flex items-center gap-2 px-2">
            <span className="flex-1 font-mono text-[0.62rem] text-muted">Clear all?</span>
            <button onClick={() => { clearAll(); setConfirmClear(false) }} className="font-mono text-[0.62rem] text-red-400">
              Yes
            </button>
            <button onClick={() => setConfirmClear(false)} className="font-mono text-[0.62rem] text-muted">
              No
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmClear(true)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 font-mono text-[0.62rem] text-muted transition-all hover:bg-card hover:text-primary">
            <Trash2 size={12} /> Clear history
          </button>
        )}
      </div>
    </motion.aside>
  )
}
