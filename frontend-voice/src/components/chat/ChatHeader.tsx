import { Mic, MessageSquare, Trash2, PanelLeft } from 'lucide-react'
import { useConversationStore } from '../../store/conversationStore'
import { truncate } from '../../lib/utils'

interface Props {
  conversationId: string
  mode: 'chat' | 'voice'
  onSwitchMode: (m: 'chat' | 'voice') => void
  onDelete: () => void
}

export default function ChatHeader({ conversationId, mode, onSwitchMode, onDelete }: Props) {
  const { getConversation, sidebarOpen, toggleSidebar } = useConversationStore()
  const conv = getConversation(conversationId)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/80 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button onClick={toggleSidebar} className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <PanelLeft size={14} />
          </button>
        )}
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${mode === 'voice' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}`}>
          {mode === 'voice' ? <Mic size={14} className="text-white" /> : <MessageSquare size={14} className="text-white/60" />}
        </div>
        <div>
          <h2 className="font-display font-bold text-sm text-white leading-tight">
            {conv ? truncate(conv.title, 36) : 'New Conversation'}
          </h2>
          <p className="font-mono text-[0.58rem] text-white/30 capitalize">{mode} mode · {conv?.messages.length ?? 0} messages</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onSwitchMode(mode === 'chat' ? 'voice' : 'chat')}
          className="flex items-center gap-1.5 border border-white/15 text-white/50 hover:text-white hover:border-white/30 font-mono text-[0.65rem] tracking-wide px-3 py-1.5 rounded-lg transition-all"
        >
          {mode === 'chat' ? <><Mic size={11} /> Voice</> : <><MessageSquare size={11} /> Chat</>}
        </button>
        {conv && (
          <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
