import type { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import { transcribeAudio } from '../services/openaiService'

export async function transcribeController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const file = req.file

  if (!file) {
    res.status(400).json({ success: false, error: 'No audio file uploaded' })
    return
  }

  try {
    const transcript = await transcribeAudio(file.path, req.body.language)

    // Cleanup uploaded file
    fs.unlink(file.path, () => {})

    res.json({ success: true, transcript })
  } catch (err) {
    // Cleanup on error too
    fs.unlink(file.path, () => {})
    next(err)
  }
}
