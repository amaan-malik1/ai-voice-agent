import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bot, Copy, Check } from 'lucide-react'
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
      <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 border', isUser ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10')}>
        {isUser ? <User size={13} className="text-white" /> : <Bot size={13} className="text-white/60" />}
      </div>

      <div className={cn('flex flex-col gap-1 max-w-[78%]', isUser ? 'items-end' : 'items-start')}>
        <div className={cn(
          'relative px-4 py-3 rounded-2xl font-mono text-[0.76rem] leading-[1.8] border',
          isUser
            ? 'bg-white text-black border-white/20 rounded-tr-sm'
            : 'bg-white/5 text-white/75 border-white/10 rounded-tl-sm'
        )}>
          {message.isLoading ? (
            <div className="flex items-center gap-1.5 py-0.5">
              {[0, 1, 2].map(i => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
                />
              ))}
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
          {!message.isLoading && (
            <button onClick={handleCopy}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-black border border-white/15 flex items-center justify-center text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
              {copied ? <Check size={10} className="text-white" /> : <Copy size={10} />}
            </button>
          )}
        </div>
        <span className="font-mono text-[0.56rem] text-white/25 px-1">{formatTime(new Date(message.timestamp))}</span>
      </div>
    </motion.div>
  )
}
