export type RecordingState = 'idle' | 'recording' | 'processing' | 'speaking'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isLoading?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  mode: 'chat' | 'voice'
}

export interface StepItem {
  number: string
  title: string
  description: string
  tag: string
  icon: string
}

export interface FeatureItem {
  id: string
  icon: string
  title: string
  description: string
  badge: 'Core' | 'Plus'
}
