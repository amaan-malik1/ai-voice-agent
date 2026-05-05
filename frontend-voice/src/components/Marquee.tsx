const ITEMS = [
  'Speech to Text',
  'Easy to Use',
  'Text to Speech',
  'Multilingual Support',
  'Hands-Free Experience',
]

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS]

  return (
    <div className="border-y my-7 border-border py-4 overflow-hidden whitespace-nowrap bg-surface/50">
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
