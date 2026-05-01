import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Check, Copy, User } from 'lucide-react'
import { cn, formatTime } from '../../lib/utils'
import type { Message } from '../../types'

export default function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={cn('group flex gap-3 px-4 py-2', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div
        className={cn(
          'mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border',
          isUser ? 'border-border-bright bg-primary text-canvas' : 'border-border bg-card text-subtle',
        )}
      >
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>

      <div className={cn('flex max-w-[78%] flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'relative rounded-2xl border px-4 py-3 font-mono text-[0.76rem] leading-[1.8]',
            isUser
              ? 'rounded-tr-sm border-border-bright bg-primary text-canvas'
              : 'rounded-tl-sm border-border bg-surface text-subtle',
          )}
        >
          {message.isLoading ? (
            <div className="flex items-center gap-1.5 py-0.5">
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  className="h-1.5 w-1.5 rounded-full bg-muted"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: index * 0.2 }}
                />
              ))}
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}

          {!message.isLoading && (
            <button
              onClick={handleCopy}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-canvas text-muted opacity-0 transition-all hover:text-primary group-hover:opacity-100"
            >
              {copied ? <Check size={10} className="text-primary" /> : <Copy size={10} />}
            </button>
          )}
        </div>
        <span className="px-1 font-mono text-[0.56rem] text-muted">{formatTime(new Date(message.timestamp))}</span>
      </div>
    </motion.div>
  )
}
