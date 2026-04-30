import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const ELEVENLABS_API_KEY  = process.env.ELEVENLABS_API_KEY ?? ''
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? 'EXAVITQu4vr4xnSDxMaL' // default: Bella

const TMP_DIR = path.join(process.cwd(), 'tmp', 'audio')

// Ensure tmp dir exists
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true })

/**
 * Convert text to speech via ElevenLabs API.
 * Returns local filename of saved audio.
 */
export async function synthesizeSpeech(
  text: string,
  voiceId: string = ELEVENLABS_VOICE_ID,
  speed: number = 1.0
): Promise<string> {
  const filename = `tts-${uuidv4()}.mp3`
  const filePath = path.join(TMP_DIR, filename)

  const response = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.5, similarity_boost: 0.75, speed },
    },
    {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      responseType: 'arraybuffer',
    }
  )

  fs.writeFileSync(filePath, Buffer.from(response.data))
  return filename
}

/**
 * Cleanup old TTS files (called periodically or after serving)
 */
export function cleanupOldFiles(maxAgeMs: number = 5 * 60 * 1000): void {
  const now = Date.now()
  try {
    const files = fs.readdirSync(TMP_DIR)
    files.forEach(file => {
      const fp = path.join(TMP_DIR, file)
      const stat = fs.statSync(fp)
      if (now - stat.mtimeMs > maxAgeMs) fs.unlinkSync(fp)
    })
  } catch { /* ignore */ }
}

export { TMP_DIR }
