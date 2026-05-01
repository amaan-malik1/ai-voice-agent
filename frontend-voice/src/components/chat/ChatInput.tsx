import { useRef, useState, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Mic, Send, Square } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Props {
  onSend: (text: string) => void
  onVoiceStart?: () => void
  onVoiceStop?: () => void
  isRecording?: boolean
  isLoading?: boolean
  disabled?: boolean
}

export default function ChatInput({
  onSend,
  onVoiceStart,
  onVoiceStop,
  isRecording = false,
  isLoading = false,
  disabled = false,
}: Props) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || isLoading || disabled) return
    onSend(trimmed)
    setText('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const onInput = () => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
    ref.current.style.height = `${Math.min(ref.current.scrollHeight, 160)}px`
  }

  return (
    <div className="flex-shrink-0 border-t border-border bg-surface/85 px-4 py-4 backdrop-blur-sm theme-transition">
      <div
        className={cn(
          'flex items-end gap-3 rounded-2xl border bg-card/80 px-4 py-3 transition-colors',
          isRecording ? 'border-violet/30' : 'border-border focus-within:border-border-bright',
        )}
      >
        <textarea
          ref={ref}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKey}
          onInput={onInput}
          disabled={disabled || isRecording}
          placeholder={isRecording ? 'Listening...' : 'Message Weblyrix...'}
          rows={1}
          className="min-h-[24px] max-h-40 flex-1 resize-none bg-transparent font-mono text-[0.78rem] leading-relaxed text-primary outline-none placeholder:text-muted disabled:opacity-40"
        />
        {(onVoiceStart || onVoiceStop) && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={isRecording ? onVoiceStop : onVoiceStart}
            disabled={isLoading || disabled}
            className={cn(
              'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border transition-all',
              isRecording
                ? 'border-violet/30 bg-violet/12 text-violet'
                : 'border-border bg-surface text-muted hover:border-border-bright hover:text-primary',
            )}
          >
            {isRecording ? <Square size={13} fill="currentColor" /> : <Mic size={13} />}
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!text.trim() || isLoading || disabled || isRecording}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-violet text-white transition-all hover:bg-violet-light disabled:cursor-not-allowed disabled:opacity-25"
        >
          <Send size={13} />
        </motion.button>
      </div>
      <p className="mt-2 text-center font-mono text-[0.56rem] text-muted">
        {isRecording ? 'Recording / press Stop when done' : 'Enter to send / Shift+Enter newline / Mic for voice'}
      </p>
    </div>
  )
}
