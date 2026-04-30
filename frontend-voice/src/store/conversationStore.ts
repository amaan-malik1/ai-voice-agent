import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Conversation, Message } from '../types'
import { generateId, getConversationTitle } from '../lib/utils'

interface Store {
  conversations: Conversation[]
  activeId: string | null
  sidebarOpen: boolean

  setActiveId: (id: string | null) => void
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void

  createConversation: (mode?: 'chat' | 'voice') => Conversation
  deleteConversation: (id: string) => void
  clearAll: () => void

  addMessage: (cid: string, msg: Omit<Message, 'id' | 'timestamp'>) => Message
  updateMessage: (cid: string, mid: string, patch: Partial<Message>) => void

  getActive: () => Conversation | undefined
  getConversation: (id: string) => Conversation | undefined
}

export const useConversationStore = create<Store>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeId: null,
      sidebarOpen: true,

      setActiveId: id => set({ activeId: id }),
      setSidebarOpen: v => set({ sidebarOpen: v }),
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

      createConversation: (mode = 'chat') => {
        const conv: Conversation = {
          id: generateId(),
          title: 'New Conversation',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          mode,
        }
        set(s => ({ conversations: [conv, ...s.conversations], activeId: conv.id }))
        return conv
      },

      deleteConversation: id =>
        set(s => ({
          conversations: s.conversations.filter(c => c.id !== id),
          activeId: s.activeId === id ? (s.conversations.find(c => c.id !== id)?.id ?? null) : s.activeId,
        })),

      clearAll: () => set({ conversations: [], activeId: null }),

      addMessage: (cid, msg) => {
        const message: Message = { ...msg, id: generateId(), timestamp: new Date() }
        set(s => ({
          conversations: s.conversations.map(c => {
            if (c.id !== cid) return c
            const messages = [...c.messages, message]
            return {
              ...c,
              messages,
              updatedAt: new Date(),
              title: c.messages.length === 0 && msg.role === 'user'
                ? getConversationTitle(msg.content)
                : c.title,
            }
          }),
        }))
        return message
      },

      updateMessage: (cid, mid, patch) =>
        set(s => ({
          conversations: s.conversations.map(c =>
            c.id !== cid ? c : {
              ...c,
              messages: c.messages.map(m => m.id === mid ? { ...m, ...patch } : m),
            }
          ),
        })),

      getActive: () => {
        const { conversations, activeId } = get()
        return conversations.find(c => c.id === activeId)
      },

      getConversation: id => get().conversations.find(c => c.id === id),
    }),
    {
      name: 'weblyrix-v2-conversations',
      partialize: s => ({
        conversations: s.conversations.map(c => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
          messages: c.messages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })),
        })),
        activeId: s.activeId,
        sidebarOpen: s.sidebarOpen,
      }),
      onRehydrateStorage: () => state => {
        if (!state) return
        state.conversations = state.conversations.map(c => ({
          ...c,
          createdAt: new Date(c.createdAt as unknown as string),
          updatedAt: new Date(c.updatedAt as unknown as string),
          messages: c.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp as unknown as string) })),
        }))
      },
    }
  )
)
