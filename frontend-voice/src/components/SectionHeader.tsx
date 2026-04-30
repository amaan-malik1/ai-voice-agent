interface SectionHeaderProps {
  tag: string
  title: React.ReactNode
  subtitle?: string
  center?: boolean
}

export default function SectionHeader({ tag, title, subtitle, center = true }: SectionHeaderProps) {
  return (
    <div className={`mb-14 ${center ? 'text-center' : ''}`}>
      <div className={`flex items-center gap-3 mb-5 font-mono text-[0.68rem] tracking-[0.22em] uppercase text-violet ${center ? 'justify-center' : ''}`}>
        <span className="w-6 h-px bg-violet" aria-hidden />
        {tag}
        <span className="w-6 h-px bg-violet" aria-hidden />
      </div>
      <h2
        className="font-display font-extrabold leading-[1.18] tracking-tight mb-4 text-white"
        style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`font-mono text-[0.78rem] text-subtle leading-[1.9] max-w-[520px] ${center ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
