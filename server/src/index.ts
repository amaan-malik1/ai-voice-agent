import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import routes from './routes'
import { errorHandler, notFound } from './middleware/errorHandler'
import { cleanupOldFiles } from './services/ttsService'

dotenv.config()

const app  = express()
const PORT = process.env.PORT ?? 5000

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', routes)

// ── Static (serve built client in production) ────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist')
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))
}

// ── Error handling ───────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Periodic cleanup of TTS audio files (every 10 min) ──────────────────────
setInterval(() => cleanupOldFiles(10 * 60 * 1000), 10 * 60 * 1000)

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎙️  Weblyrix Server running on http://localhost:${PORT}`)
  console.log(`   OpenAI API key:     ${process.env.OPENAI_API_KEY ? '✅ set' : '❌ missing'}`)
  console.log(`   ElevenLabs API key: ${process.env.ELEVENLABS_API_KEY ? '✅ set' : '❌ missing'}`)
  console.log(`   Client URL:         ${process.env.CLIENT_URL ?? 'http://localhost:5173'}\n`)
})

export default app
