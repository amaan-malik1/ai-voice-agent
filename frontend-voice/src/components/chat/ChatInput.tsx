import { useState, useRef, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, Square } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Props {
  onSend: (text: string) => void
  onVoiceStart?: () => void
  onVoiceStop?: () => void
  isRecording?: boolean
  isLoading?: boolean
  disabled?: boolean
}

export default function ChatInput({ onSend, onVoiceStart, onVoiceStop, isRecording = false, isLoading = false, disabled = false }: Props) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const t = text.trim()
    if (!t || isLoading || disabled) return
    onSend(t)
    setText('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const onInput = () => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
    ref.current.style.height = `${Math.min(ref.current.scrollHeight, 160)}px`
  }

  return (
    <div className="px-4 py-4 border-t border-white/10 bg-black/80 backdrop-blur-sm flex-shrink-0">
      <div className={cn(
        'flex items-end gap-3 bg-white/5 border rounded-2xl px-4 py-3 transition-colors',
        isRecording ? 'border-white/30' : 'border-white/10 focus-within:border-white/25'
      )}>
        <textarea
          ref={ref}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={onKey}
          onInput={onInput}
          disabled={disabled || isRecording}
          placeholder={isRecording ? 'Listening…' : 'Message Weblyrix…'}
          rows={1}
          className="flex-1 bg-transparent font-mono text-[0.78rem] text-white placeholder:text-white/25 outline-none resize-none leading-relaxed min-h-[24px] max-h-40 disabled:opacity-40"
        />
        {(onVoiceStart || onVoiceStop) && (
          <motion.button whileTap={{ scale: 0.9 }}
            onClick={isRecording ? onVoiceStop : onVoiceStart}
            disabled={isLoading || disabled}
            className={cn(
              'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-all',
              isRecording ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/25'
            )}>
            {isRecording ? <Square size={13} fill="currentColor" /> : <Mic size={13} />}
          </motion.button>
        )}
        <motion.button whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!text.trim() || isLoading || disabled || isRecording}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white text-black hover:bg-white/90 transition-all disabled:opacity-25 disabled:cursor-not-allowed">
          <Send size={13} />
        </motion.button>
      </div>
      <p className="font-mono text-[0.56rem] text-white/20 text-center mt-2">
        {isRecording ? 'Recording — press Stop when done' : 'Enter to send · Shift+Enter newline · Mic for voice'}
      </p>
    </div>
  )
}
