# Weblyrix — AI Voice Assistant (Full-Stack)

> React 18 + TypeScript + Tailwind CSS + Framer Motion  
> Node.js + Express + OpenAI Whisper + GPT + ElevenLabs TTS  
> Weblyrix Digital Solutions · v2.0 · April 2026

---

## Quick Start

### 1. Install everything

```bash
npm install && cd client && npm install && cd ../server && npm install
```

### 2. Configure environment variables

```bash
# Server
cd server
cp .env.example .env

# Client
cd ../client
cp .env.example .env
```

### 3. Run both dev servers

```bash
# From root (requires concurrently)
npm install && npm run dev

# OR run separately:
cd client && npm run dev   # → http://localhost:5173
cd server && npm run dev   # → http://localhost:5000
```

---

## Features

### Frontend (React + TypeScript + Tailwind + Framer Motion)

- **Sidebar** — ChatGPT-style with full conversation history (localStorage via Zustand persist)
- **Chat Page** — Message bubbles, typing indicator, copy button, suggestion chips
- **Voice Page** — Perplexity-style: 3D orb + waveform visualizer + transcript panel
- **Dual mode** — Switch between Chat and Voice per conversation
- **Spacebar shortcut** — Press Space to toggle mic on Voice page
- **Custom cursor** — Framer Motion magnetic cursor

### Backend (Node.js + Express + TypeScript)

| Route              | Method | Description                   |
| ------------------ | ------ | ----------------------------- |
| `/api/health`      | GET    | Health check + API key status |
| `/api/transcribe`  | POST   | Audio → Whisper STT → text    |
| `/api/chat`        | POST   | Messages → GPT → reply        |
| `/api/tts`         | POST   | Text → ElevenLabs → audio URL |
| `/api/audio/:file` | GET    | Serve TTS audio file          |

---
## Project Structure

```
weblyrix-fullstack/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/              # MessageBubble, ChatInput, ChatHeader
│   │   │   ├── voice/             # VoiceOrb, WaveformVisualizer
│   │   │   ├── sidebar/           # Sidebar with history
│   │   │   └── ui/                # Cursor, Button, Tooltip
│   │   ├── hooks/
│   │   │   ├── useRecorder.ts     # MediaRecorder + audio level
│   │   │   └── useVoicePipeline.ts # STT → AI → TTS pipeline
│   │   ├── pages/
│   │   │   ├── AppShell.tsx       # Root layout
│   │   │   ├── ChatPage.tsx       # Chat interface
│   │   │   └── VoicePage.tsx      # Voice interface
│   │   ├── store/
│   │   │   └── conversationStore.ts # Zustand store + localStorage
│   │   ├── lib/
│   │   │   ├── api.ts             # Axios API calls
│   │   │   └── utils.ts           # cn(), formatTime(), etc.
│   │   └── types/index.ts
│   └── .env.example
│
│
└── README.md
```

---

## API Keys

| Service    | Purpose           | Get Key                              |
| ---------- | ----------------- | ------------------------------------ |
| OpenAI     | Whisper STT + GPT | https://platform.openai.com/api-keys |
| ElevenLabs | Text-to-Speech    | https://elevenlabs.io                |

