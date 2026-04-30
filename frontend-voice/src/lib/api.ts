import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL ?? 'http://localhost:5000',
  timeout: 30_000,
})

api.interceptors.response.use(
  res => res,
  err => Promise.reject(new Error(err.response?.data?.error ?? err.message ?? 'Request failed'))
)

export async function transcribeAudio(blob: Blob): Promise<string> {
  const form = new FormData()
  form.append('audio', blob, 'recording.webm')
  const { data } = await api.post<{ transcript: string }>('/api/transcribe', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.transcript
}

export async function sendChatMessage(
  messages: { role: string; content: string }[]
): Promise<string> {
  const { data } = await api.post<{ reply: string }>('/api/chat', { messages })
  return data.reply
}

export async function textToSpeech(text: string): Promise<string> {
  const { data } = await api.post<{ audioUrl: string }>('/api/tts', { text })
  return `http://localhost:5000${data.audioUrl}`
}

export default api
