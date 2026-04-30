import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageSquare, Mic, Trash2, ChevronLeft, ChevronRight, Search, Clock } from 'lucide-react'
import { useConversationStore } from '../../store/conversationStore'
import { cn, formatDate, truncate } from '../../lib/utils'
import type { Conversation } from '../../types'

interface Props {
  onNavigate: (mode: 'chat' | 'voice', id: string) => void
}

export default function Sidebar({ onNavigate }: Props) {
  const { conversations, activeId, sidebarOpen, toggleSidebar, createConversation, deleteConversation, setActiveId, clearAll } = useConversationStore()
  const [search, setSearch] = useState('')
  const [hovered, setHovered] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const filtered = conversations.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))

  const grouped = filtered.reduce<Record<string, Conversation[]>>((acc, c) => {
    const label = formatDate(new Date(c.updatedAt))
    acc[label] = [...(acc[label] ?? []), c]
    return acc
  }, {})

  const handleNew = (mode: 'chat' | 'voice') => {
    const conv = createConversation(mode)
    onNavigate(mode, conv.id)
  }

  const handleSelect = (conv: Conversation) => {
    setActiveId(conv.id)
    onNavigate(conv.mode, conv.id)
  }

  if (!sidebarOpen) return (
    <div className="flex flex-col items-center gap-3 w-14 h-full bg-black border-r border-white/10 py-4 px-2 flex-shrink-0">
      <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-mono font-bold text-xs text-black mb-2">W</div>
      <button onClick={toggleSidebar} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5">
        <ChevronRight size={15} />
      </button>
      <button onClick={() => handleNew('chat')} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5">
        <MessageSquare size={15} />
      </button>
      <button onClick={() => handleNew('voice')} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5">
        <Mic size={15} />
      </button>
    </div>
  )

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 272, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="h-full bg-black border-r border-white/10 flex flex-col overflow-hidden flex-shrink-0"
      style={{ minWidth: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-mono font-bold text-xs text-black">W</div>
          <span className="font-display font-bold text-sm tracking-widest uppercase text-white">Weblyrix</span>
        </div>
        <button onClick={toggleSidebar} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* New buttons */}
      <div className="px-3 py-3 flex gap-2 border-b border-white/10 flex-shrink-0">
        <button onClick={() => handleNew('chat')} className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl py-2.5 font-mono text-[0.68rem] tracking-wide transition-all">
          <Plus size={12} /> Chat
        </button>
        <button onClick={() => handleNew('voice')} className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 rounded-xl py-2.5 font-mono text-[0.68rem] tracking-wide transition-all">
          <Mic size={12} /> Voice
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <Search size={12} className="text-white/30 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent font-mono text-[0.68rem] text-white placeholder:text-white/30 outline-none"
          />
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto py-2 px-2" style={{ scrollbarWidth: 'none' }}>
        {Object.keys(grouped).length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <Clock size={22} className="text-white/20" />
            <p className="font-mono text-[0.62rem] text-white/30 text-center">{search ? 'No results' : 'No conversations yet'}</p>
          </div>
        )}
        {Object.entries(grouped).map(([date, convs]) => (
          <div key={date} className="mb-4">
            <p className="font-mono text-[0.58rem] tracking-widest uppercase text-white/25 px-2 mb-1.5">{date}</p>
            {convs.map(conv => (
              <div
                key={conv.id}
                onMouseEnter={() => setHovered(conv.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleSelect(conv)}
                className={cn(
                  'group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 mb-0.5',
                  activeId === conv.id ? 'bg-white/10 border border-white/15' : 'hover:bg-white/5 border border-transparent'
                )}
              >
                <div className={cn('w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0', conv.mode === 'voice' ? 'bg-white/10' : 'bg-white/10')}>
                  {conv.mode === 'voice' ? <Mic size={10} className="text-white/60" /> : <MessageSquare size={10} className="text-white/60" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('font-mono text-[0.68rem] truncate', activeId === conv.id ? 'text-white' : 'text-white/60')}>{truncate(conv.title, 24)}</p>
                  <p className="font-mono text-[0.56rem] text-white/25">{conv.messages.length} msg{conv.messages.length !== 1 ? 's' : ''}</p>
                </div>
                <AnimatePresence>
                  {hovered === conv.id && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.12 }}
                      onClick={e => { e.stopPropagation(); deleteConversation(conv.id) }}
                      className="w-5 h-5 flex items-center justify-center rounded text-white/30 hover:text-red-400 transition-colors"
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

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/10 flex-shrink-0">
        {confirmClear ? (
          <div className="flex items-center gap-2 px-2">
            <span className="font-mono text-[0.62rem] text-white/40 flex-1">Clear all?</span>
            <button onClick={() => { clearAll(); setConfirmClear(false) }} className="font-mono text-[0.62rem] text-red-400">Yes</button>
            <button onClick={() => setConfirmClear(false)} className="font-mono text-[0.62rem] text-white/40">No</button>
          </div>
        ) : (
          <button onClick={() => setConfirmClear(true)} className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all font-mono text-[0.62rem]">
            <Trash2 size={12} /> Clear history
          </button>
        )}
      </div>
    </motion.aside>
  )
}
