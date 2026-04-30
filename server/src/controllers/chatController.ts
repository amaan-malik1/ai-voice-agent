import type { Request, Response, NextFunction } from 'express'
import { generateChatResponse } from '../services/openaiService'
import type { ChatRequestBody } from '../types'

export async function chatController(
  req: Request<object, object, ChatRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { messages, model } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ success: false, error: 'messages array is required' })
    return
  }

  try {
    const reply = await generateChatResponse(messages, model)
    res.json({ success: true, reply })
  } catch (err) {
    next(err)
  }
}
