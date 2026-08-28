import type { ReactNode } from 'react'

export const Gradient = 'bg-gradient-to-br from-[#6a1fc2] via-[#2a5ff5] to-[#00c4b4]'

export function Footer({ n, label }: { n: number; light?: boolean; label?: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-9 flex items-center justify-between px-5">
      <span className="text-[10px] uppercase tracking-widest text-[#aaa]">
        {label ?? ''}
      </span>
      <span className="text-xs flex items-center gap-1 text-[#888]">
        <span className="w-3.5 h-3.5 rounded-sm bg-[#ddd]" />
        {n}
      </span>
    </div>
  )
}

// Syntax-highlight helpers for inline code snippets — wrap tokens by role.
export const kw = (s: string) => <span className="text-[#1a56cc]">{s}</span>
export const st = (s: string) => <span className="text-[#0e7490]">{s}</span>
export const cm = (s: string) => <span className="text-[#9ca3af]">{s}</span>
export const hl = (s: string) => <span className="text-[#7c3aed]">{s}</span>
export const ok = (s: string) => <span className="text-[#16a34a]">{s}</span>
export const er = (s: string) => <span className="text-[#dc2626]">{s}</span>

export function Code({ children, compact }: { children: ReactNode; compact?: boolean }) {
  return (
    <pre className={`bg-[#f1f5f9] rounded-lg font-mono overflow-hidden text-[#1e293b] ${compact ? 'p-3 text-[12px] leading-5' : 'p-4 text-[13px] leading-6'}`}>
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
    <div className="w-full h-full flex flex-col px-12 pt-9 pb-14 bg-white">
      {eyebrow && (
        <div className="text-[11px] text-[#9ca3af] uppercase tracking-widest mb-1">{eyebrow}</div>
      )}
      <h2 className="text-[26px] font-semibold text-[#111827] mb-8 border-l-[3px] border-[#1a73e8] pl-3">
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
    <div className="w-full h-full flex items-center justify-center bg-[#f8fafc]">
      <div className="bg-white rounded-xl px-16 py-10 text-center min-w-[55%] border border-[#e5e7eb]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="text-[11px] text-[#9ca3af] tracking-widest mb-2">{eyebrow}</div>
        <h2 className="text-[32px] font-semibold text-[#111827] mb-3">{title}</h2>
        {subtitle && <p className="text-[16px] text-[#6b7280]">{subtitle}</p>}
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
  speakerPhoto,
  speakerName,
  speakerRole,
  speakerLinks,
  slideNumber,
  footerLabel,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  speakerPhoto?: string
  speakerName?: string
  speakerRole?: ReactNode
  speakerLinks?: ReactNode
  slideNumber: number
  footerLabel?: string
}) {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex flex-1 px-12 pt-10 pb-4 gap-12">
        <div className="flex flex-col justify-center flex-1 gap-4">
          {eyebrow && (
            <div className="text-[11px] text-[#9ca3af] uppercase tracking-widest">{eyebrow}</div>
          )}
          <h1 className="text-[38px] font-semibold text-[#111827] leading-tight">{title}</h1>
          {subtitle && <div className="text-[14px] text-[#6b7280] font-medium">{subtitle}</div>}
        </div>

        {(speakerPhoto || speakerName || speakerRole || speakerLinks) && (
          <div className="flex flex-col items-start justify-center gap-3" style={{ minWidth: 220 }}>
            {speakerPhoto && (
              <img
                src={speakerPhoto}
                alt={speakerName ?? 'Speaker'}
                className="w-32 h-32 rounded-xl object-cover border border-[#e5e7eb]"
              />
            )}
            {speakerName && (
              <div className="text-[22px] font-semibold text-[#111827] leading-tight">{speakerName}</div>
            )}
            {speakerRole && <div className="text-[13px] text-[#4b5563] leading-5">{speakerRole}</div>}
            {speakerLinks && <div className="text-[12px] text-[#6b7280] leading-5">{speakerLinks}</div>}
          </div>
        )}
      </div>

      <Footer n={slideNumber} label={footerLabel} />
    </div>
  )
}
