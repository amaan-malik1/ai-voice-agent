import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { transcribeController } from '../controllers/transcribeController'
import { chatController } from '../controllers/chatController'
import { ttsController, serveAudioController } from '../controllers/ttsController'

const router = Router()

// ── Multer for audio uploads ────────────────────────────────────────────────
const uploadDir = path.join(process.cwd(), 'tmp', 'uploads')
import fs from 'fs'
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, _file, cb) => cb(null, `${uuidv4()}.webm`),
})

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max (Whisper limit)
  fileFilter: (_req, file, cb) => {
    const allowed = ['audio/webm', 'audio/mp4', 'audio/wav', 'audio/mpeg', 'audio/ogg', 'video/webm']
    cb(null, allowed.includes(file.mimetype))
  },
})

// ── Health ──────────────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      openai:     !!process.env.OPENAI_API_KEY,
      elevenlabs: !!process.env.ELEVENLABS_API_KEY,
    },
  })
})

// ── STT: POST /api/transcribe ───────────────────────────────────────────────
router.post('/transcribe', upload.single('audio'), transcribeController)

// ── Chat: POST /api/chat ────────────────────────────────────────────────────
router.post('/chat', chatController)

// ── TTS: POST /api/tts ─────────────────────────────────────────────────────
router.post('/tts', ttsController)

// ── Serve audio: GET /api/audio/:filename ──────────────────────────────────
router.get('/audio/:filename', serveAudioController)

export default router
