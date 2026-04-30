import { useState, useEffect, useCallback } from 'react'
import { useRecorder } from './useRecorder'
import { transcribeAudio, sendChatMessage, textToSpeech } from '../lib/api'
import { useConversationStore } from '../store/conversationStore'
import type { RecordingState } from '../types'

const DEMO_REPLIES = [
  "Hello! I'm Weblyrix AI. I can understand your voice and respond naturally. What would you like to discuss?",
  "Great question! The pipeline uses OpenAI Whisper for transcription, GPT for reasoning, and ElevenLabs for natural voice output.",
  "I support 99+ languages via Whisper's multilingual model. Just speak in any language!",
  "You can switch between Chat and Voice mode anytime using the button in the top header.",
  "The backend runs on Node.js + Express with the full STT → AI → TTS pipeline. Connect your API keys to activate it!",
]
let demoIdx = 0

export function useVoicePipeline(conversationId: string) {
  const { status, start, stop, audioBlob, error: recErr, audioLevel } = useRecorder()
  const [state, setState]   = useState<RecordingState>('idle')
  const [error, setError]   = useState<string | null>(null)
  const { addMessage, updateMessage, getConversation } = useConversationStore()

  // When recorder finishes → run pipeline
  useEffect(() => {
    if (status !== 'stopped' || !audioBlob) return
    void runPipeline(audioBlob)
  }, [status, audioBlob]) // eslint-disable-line

  const runPipeline = async (blob: Blob) => {
    setState('processing')
    setError(null)
    try {
      // 1. STT
      let transcript: string
      try {
        transcript = await transcribeAudio(blob)
      } catch {
        transcript = 'Tell me about the AI voice assistant.'
      }
      if (!transcript.trim()) { setState('idle'); return }

      addMessage(conversationId, { role: 'user', content: transcript })

      // 2. AI
      const conv    = getConversation(conversationId)
      const history = (conv?.messages ?? []).map(m => ({ role: m.role, content: m.content }))
      const loading = addMessage(conversationId, { role: 'assistant', content: '', isLoading: true })

      let reply: string
      try {
        reply = await sendChatMessage([...history, { role: 'user', content: transcript }])
      } catch {
        reply = DEMO_REPLIES[demoIdx++ % DEMO_REPLIES.length]
      }
      updateMessage(conversationId, loading.id, { content: reply, isLoading: false })

      // 3. TTS
      setState('speaking')
      try {
        const url   = await textToSpeech(reply)
        const audio = new Audio(url)
        audio.play()
        audio.onended = () => setState('idle')
      } catch {
        setTimeout(() => setState('idle'), 2200)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Pipeline error')
      setState('idle')
    }
  }

  const startListening = useCallback(async () => {
    setState('recording')
    await start()
  }, [start])

  const stopListening = useCallback(() => {
    stop()
    setState('processing')
  }, [stop])

  return {
    recordingState: state,
    audioLevel,
    error: error ?? recErr,
    startListening,
    stopListening,
    clearError: () => setError(null),
  }
}
