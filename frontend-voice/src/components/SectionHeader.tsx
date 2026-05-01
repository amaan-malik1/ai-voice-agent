interface SectionHeaderProps {
  tag: string
  title: React.ReactNode
  subtitle?: string
  center?: boolean
}

export default function SectionHeader({ tag, title, subtitle, center = true }: SectionHeaderProps) {
  return (
    <div className={`mb-14 ${center ? 'text-center' : ''}`}>
      <div className={`mb-5 flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-violet ${center ? 'justify-center' : ''}`}>
        <span className="h-px w-6 bg-violet" aria-hidden />
        {tag}
        <span className="h-px w-6 bg-violet" aria-hidden />
      </div>
      <h2
        className="mb-4 font-display font-extrabold leading-[1.18] tracking-tight text-primary"
        style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`max-w-[520px] font-mono text-[0.78rem] leading-[1.9] text-subtle ${center ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
