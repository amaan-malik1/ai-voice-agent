# Weblyrix — AI Voice Assistant Frontend

> React 18 + TypeScript + Vite + Tailwind CSS v3 + Framer Motion
> Weblyrix Digital Solutions · v1.0 · April 2026

## Quick Start

npm install
npm run dev
# http://localhost:5173

## Build

npm run build

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS v3 (all styling - no CSS files per component)
- Framer Motion v12 (all animations, cursor, transitions)
- Lucide React (icons)
- clsx + tailwind-merge (class utilities)

## Connect Real Backend (VoiceDemo.tsx)
Replace simulation with:
  POST /api/transcribe  -> Whisper STT
  POST /api/chat        -> LLaMA 3 / GPT
  GET  audioUrl         -> ElevenLabs TTS playback
