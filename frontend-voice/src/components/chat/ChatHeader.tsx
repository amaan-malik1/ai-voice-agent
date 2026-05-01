import { MessageSquare, Mic, PanelLeft, Trash2 } from 'lucide-react'
import { truncate } from '../../lib/utils'
import { useConversationStore } from '../../store/conversationStore'

interface Props {
  conversationId: string
  mode: 'chat' | 'voice'
  onSwitchMode: (mode: 'chat' | 'voice') => void
  onDelete: () => void
}

export default function ChatHeader({ conversationId, mode, onSwitchMode, onDelete }: Props) {
  const { getConversation, sidebarOpen, toggleSidebar } = useConversationStore()
  const conversation = getConversation(conversationId)

  return (
    <div className="flex flex-shrink-0 items-center justify-between border-b border-border bg-surface/85 px-4 py-3 backdrop-blur-sm theme-transition">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button onClick={toggleSidebar} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-card hover:text-primary">
            <PanelLeft size={14} />
          </button>
        )}
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${mode === 'voice' ? 'border-violet/25 bg-violet/12 text-violet' : 'border-border bg-card text-subtle'}`}>
          {mode === 'voice' ? <Mic size={14} /> : <MessageSquare size={14} />}
        </div>
        <div>
          <h2 className="font-display text-sm font-bold leading-tight text-primary">
            {conversation ? truncate(conversation.title, 36) : 'New Conversation'}
          </h2>
          <p className="font-mono text-[0.58rem] capitalize text-muted">
            {mode} mode / {conversation?.messages.length ?? 0} messages
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onSwitchMode(mode === 'chat' ? 'voice' : 'chat')}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card/70 px-3 py-1.5 font-mono text-[0.65rem] tracking-wide text-subtle transition-all hover:border-border-bright hover:text-primary"
        >
          {mode === 'chat' ? <><Mic size={11} /> Voice</> : <><MessageSquare size={11} /> Chat</>}
        </button>
        {conversation && (
          <button onClick={onDelete} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-400/10 hover:text-red-400">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
