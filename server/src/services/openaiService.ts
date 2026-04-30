import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import type { ChatMessage } from '../types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are Weblyrix, an intelligent AI voice assistant built by Weblyrix Digital Solutions. 
You are helpful, concise, and conversational. 
When responding to voice queries, keep answers clear and natural-sounding — avoid markdown formatting in voice responses.
You support voice input via OpenAI Whisper and text-to-speech via ElevenLabs.
Be friendly, accurate, and professional.`

/**
 * Transcribe audio file using OpenAI Whisper
 */
export async function transcribeAudio(filePath: string, language?: string): Promise<string> {
  const fileStream = fs.createReadStream(filePath)

  const response = await openai.audio.transcriptions.create({
    file: fileStream,
    model: 'whisper-1',
    language: language ?? undefined,
    response_format: 'text',
  })

  return typeof response === 'string' ? response : (response as { text: string }).text
}

/**
 * Generate AI chat response using GPT
 */
export async function generateChatResponse(
  messages: ChatMessage[],
  model: string = 'gpt-3.5-turbo'
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    max_tokens: 500,
    temperature: 0.7,
  })

  return completion.choices[0]?.message?.content ?? 'I could not generate a response.'
}
