import type { ReactNode } from 'react'

export const Gradient = 'bg-gradient-to-br from-[#6a1fc2] via-[#2a5ff5] to-[#00c4b4]'

export function Footer({ n, light, label }: { n: number; light?: boolean; label?: string }) {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-9 flex items-center justify-between px-5 ${
        light ? 'bg-white' : ''
      }`}
    >
      <span className={`text-[10px] uppercase tracking-widest ${light ? 'text-[#aaa]' : 'text-white/40'}`}>
        {label ?? ''}
      </span>
      <span className={`text-xs flex items-center gap-1 ${light ? 'text-[#888]' : 'text-white/60'}`}>
        <span className={`w-3.5 h-3.5 rounded-sm ${light ? 'bg-[#ddd]' : 'bg-white/20'}`} />
        {n}
      </span>
    </div>
  )
}

// Syntax-highlight helpers for inline code snippets — wrap tokens by role.
export const kw = (s: string) => <span className="text-[#2a5ff5]">{s}</span>
export const st = (s: string) => <span className="text-[#00c4b4]">{s}</span>
export const cm = (s: string) => <span className="text-white/40">{s}</span>
export const hl = (s: string) => <span className="text-[#a78bfa]">{s}</span>
export const ok = (s: string) => <span className="text-[#4ade80]">{s}</span>
export const er = (s: string) => <span className="text-[#f87171]">{s}</span>

export function Code({ children, compact }: { children: ReactNode; compact?: boolean }) {
  return (
    <pre className={`bg-black/40 rounded-lg font-mono overflow-hidden text-white/85 ${compact ? 'p-3 text-[12px] leading-5' : 'p-4 text-[13px] leading-6'}`}>
      <code>{children}</code>
    </pre>
  )
}

/** Full-bleed dark content slide: title bar + free-form body, with a footer slide number. */
export function ContentSlide({
  eyebrow,
  title,
  slideNumber,
  footerLabel,
  children,
}: {
  eyebrow?: string
  title: string
  slideNumber: number
  footerLabel?: string
  children: ReactNode
}) {
  return (
    <div className="w-full h-full flex flex-col px-12 pt-9 pb-14 bg-[#0d0d12]">
      {eyebrow && (
        <div className="text-[11px] text-white/40 uppercase tracking-widest mb-1">{eyebrow}</div>
      )}
      <h2 className="text-[26px] font-light text-white mb-8 border-l-[3px] border-[#2a5ff5] pl-3">
        {title}
      </h2>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      <Footer n={slideNumber} label={footerLabel} />
    </div>
  )
}

/** Full-bleed gradient section divider ("Act 1", "Part 2", …). */
export function SectionSlide({
  eyebrow,
  title,
  subtitle,
  slideNumber,
  footerLabel,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  slideNumber: number
  footerLabel?: string
}) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${Gradient}`}>
      <div className="bg-white/95 rounded-lg px-16 py-10 text-center min-w-[55%]">
        <div className="text-[11px] text-[#888] tracking-widest mb-2">{eyebrow}</div>
        <h2 className="text-[32px] font-light text-[#1a3a6b] mb-3">{title}</h2>
        {subtitle && <p className="text-[16px] text-[#555]">{subtitle}</p>}
      </div>
      <Footer n={slideNumber} label={footerLabel} />
    </div>
  )
}

/** Opening/title slide: talk title + speaker card, gradient background. */
export function TitleSlide({
  eyebrow,
  title,
  subtitle,
  speakerName,
  speakerRole,
  speakerLinks,
  slideNumber,
  footerLabel,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  speakerName?: string
  speakerRole?: ReactNode
  speakerLinks?: ReactNode
  slideNumber: number
  footerLabel?: string
}) {
  return (
    <div className={`w-full h-full flex flex-col ${Gradient}`}>
      <div className="flex flex-1 px-12 pt-10 pb-4 gap-12">
        <div className="flex flex-col justify-center flex-1 gap-4">
          {eyebrow && (
            <div className="text-[11px] text-white/50 uppercase tracking-widest">{eyebrow}</div>
          )}
          <h1 className="text-[38px] font-light text-white leading-tight">{title}</h1>
          {subtitle && <div className="text-[14px] text-white/60 font-light">{subtitle}</div>}
        </div>

        {(speakerName || speakerRole || speakerLinks) && (
          <div className="flex flex-col justify-center gap-3" style={{ minWidth: 220 }}>
            {speakerName && (
              <div className="text-[22px] font-semibold text-white leading-tight">{speakerName}</div>
            )}
            {speakerRole && <div className="text-[13px] text-white/80 leading-5">{speakerRole}</div>}
            {speakerLinks && <div className="text-[12px] text-white/50 leading-5">{speakerLinks}</div>}
          </div>
        )}
      </div>

      <Footer n={slideNumber} label={footerLabel} />
    </div>
  )
}
