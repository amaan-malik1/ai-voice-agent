const LINKS = {
  Product: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Live Demo', href: '#demo' },
    { label: 'Features', href: '#features' },
  ],
  'Support Links': [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Us', href: '#' },
  ],

  'Other Links': [
    { label: 'About Us', href: '#' },
    { label: 'Career', href: '#' },
    { label: 'Contact Us', href: '#' },
  ]
}

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-12 pt-14 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet flex items-center justify-center font-mono font-bold text-sm text-white">W</div>
              <span className="font-display font-bold text-sm tracking-[0.18em] uppercase text-primary">Weblyrix</span>
            </div>
            <p className="font-mono text-[0.65rem] text-muted tracking-wide leading-relaxed">
              AI Voice Assistant · v1.0<br />
              April 2026 · Digital Solutions
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([col, links]) => (
            <div key={col}>
              <p className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-muted mb-4">{col}</p>
              <ul className="flex flex-col gap-3">
                {links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-mono text-[0.72rem] text-subtle hover:text-violet transition-colors duration-200"
                      data-cursor="true"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-center items-center gap-3">
          <span className="text-center font-mono text-[0.62rem] text-muted">
            © {new Date().getFullYear()} Weblyrix Digital Solutions. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}
