const ITEMS = [
  'Speech to Text',
  'AI Response Generation',
  'Text to Speech',
  'React + TypeScript',
  'Node.js Backend',
  'OpenAI Whisper',
  'LLaMA 3 Ready',
  'ElevenLabs TTS',
  'Multilingual Support',
  'Hands-Free Experience',
]

export default function Marquee() {
  // Double for seamless loop
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="border-y border-border py-4 overflow-hidden whitespace-nowrap bg-surface/50">
      <div className="inline-flex animate-marquee">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 mx-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet flex-shrink-0" aria-hidden />
            <span className="font-mono text-[0.72rem] tracking-[0.15em] uppercase text-muted">{item}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
