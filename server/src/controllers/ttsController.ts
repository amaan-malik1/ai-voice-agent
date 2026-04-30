import type { Request, Response, NextFunction } from 'express'
import path from 'path'
import { synthesizeSpeech, TMP_DIR } from '../services/ttsService'
import type { TTSRequestBody } from '../types'

export async function ttsController(
  req: Request<object, object, TTSRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { text, voice, speed } = req.body

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({ success: false, error: 'text is required' })
    return
  }

  if (text.length > 5000) {
    res.status(400).json({ success: false, error: 'text is too long (max 5000 chars)' })
    return
  }

  try {
    const filename = await synthesizeSpeech(text.trim(), voice, speed)
    // Return a URL the client can hit to stream the audio
    res.json({ success: true, audioUrl: `/api/audio/${filename}` })
  } catch (err) {
    next(err)
  }
}

/** Serve a saved TTS audio file */
export function serveAudioController(req: Request, res: Response): void {
  const { filename } = req.params
  // Basic path traversal guard
  const safe = path.basename(filename)
  const filePath = path.join(TMP_DIR, safe)
  res.sendFile(filePath, err => {
    if (err) res.status(404).json({ success: false, error: 'Audio not found' })
  })
}
