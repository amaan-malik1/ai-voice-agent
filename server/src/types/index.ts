export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatRequestBody {
  messages: ChatMessage[]
  conversationId?: string
  model?: string
}

export interface TTSRequestBody {
  text: string
  voice?: string
  speed?: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
