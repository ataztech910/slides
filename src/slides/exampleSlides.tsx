import { useEffect, useState } from 'react'
import type { SlideDef, SlideProps } from '../engine/types'
import { Code, ContentSlide, SectionSlide, TitleSlide, kw, st, cm, hl, ok } from '../engine/primitives'
import speakerPhoto from '../assets/speaker.png'
import organizerAndrii from '../assets/gdg/organizer-andrii.jpg'
import organizerGleb from '../assets/gdg/organizer-gleb.jpg'
import organizerVlad from '../assets/gdg/organizer-vlad.jpg'
import eventUpcoming from '../assets/gdg/event-upcoming.jpg'
import eventDevfest from '../assets/gdg/event-devfest.png'
import wifiWelcome from '../assets/wifi/wifi-1-welcome.jpg'
import wifiRegister from '../assets/wifi/wifi-2-register.jpg'
import wifiWaiting from '../assets/wifi/wifi-3-waiting.jpg'

const FOOTER = 'Build AI Agents · 2026'

// ─── shared helpers ──────────────────────────────────────────────────────────

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start text-[16px] text-[#1f2937] font-medium leading-snug">
      <span className="text-[#2a5ff5] mt-0.5 shrink-0">▸</span>
      <span>{children}</span>
    </div>
  )
}

function Tag({ color, children }: { color: string; children: string }) {
  return (
    <span
      className="text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded"
      style={{ background: color + '22', color }}
    >
      {children}
    </span>
  )
}

/** Self-contained countdown that starts on mount. minutes=0 means no countdown. */
function ActivityTimer({ minutes }: { minutes: number }) {
  const totalSec = minutes * 60
  const [remaining, setRemaining] = useState(totalSec)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    // auto-start 1 second after slide appears
    const kickoff = setTimeout(() => setStarted(true), 1000)
    return () => clearTimeout(kickoff)
  }, [])

  useEffect(() => {
    if (!started || remaining <= 0) return
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(id)
  }, [started, remaining])

  const m = Math.floor(remaining / 60)
  const s = remaining % 60
  const pct = totalSec > 0 ? ((totalSec - remaining) / totalSec) * 100 : 0
  const barColor = remaining > totalSec * 0.4 ? '#4ade80' : remaining > totalSec * 0.15 ? '#fbbf24' : '#f87171'
  const done = remaining === 0

  return (
    <div className="flex items-center gap-3 bg-[#111827] rounded-lg px-4 py-2.5">
      <span className="text-[13px] text-white/50 font-medium shrink-0">
        {done ? "✓ time's up" : started ? 'remaining' : 'starts in 1s…'}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <span
        className="text-[22px] font-mono font-bold tabular-nums shrink-0"
        style={{ color: done ? '#f87171' : barColor }}
      >
        {done ? '0:00' : `${m}:${String(s).padStart(2, '0')}`}
      </span>
    </div>
  )
}

// ─── GDG LINZ — community intro ────────────────────────────────────────────

function Slide00aCommunity({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Welcome" title="GDG Linz" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
        <div className="text-[20px] text-[#374151] font-medium leading-relaxed max-w-2xl">
          A vibrant community of tech enthusiasts, innovators, and developers
          passionate about all things Google and technology.
        </div>
        <div className="flex gap-8 text-[14px] text-[#4b5563]">
          <div className="flex flex-col items-center gap-1">
            <div className="text-[28px] font-semibold text-[#2a5ff5]">294</div>
            <div className="uppercase tracking-widest text-[11px]">Members</div>
          </div>
          <div className="w-px bg-[#e5e7eb]" />
          <div className="flex flex-col items-center gap-1">
            <div className="text-[28px] font-semibold text-[#2a5ff5]">#13</div>
            <div className="uppercase tracking-widest text-[11px]">Meetup</div>
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide00aaAbout({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Welcome" title="Who we are" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-4 h-full justify-center max-w-2xl mx-auto">
        <Bullet>📍 Linz, Austria · 294 members</Bullet>
        <Bullet>Focus: Android, Flutter, Google Cloud, Firebase, and the wider Google ecosystem</Bullet>
        <Bullet>Format: meetups, hands-on workshops, guest talks, and an annual DevFest hackathon</Bullet>
        <Bullet>Mission: collaboration and knowledge sharing — a supportive environment to learn, connect, and grow</Bullet>
        <Bullet>Backed by Google and Dynatrace</Bullet>
      </div>
    </ContentSlide>
  )
}

function Slide00bOrganizers({ slideNumber }: SlideProps) {
  const organizers = [
    { name: 'Andrii Khrystian', role: 'GDG Organizer · Dynatrace', photo: organizerAndrii },
    { name: 'Gleb Maliborsky', role: 'Organizer', photo: organizerGleb },
    { name: 'Vladyslav Kravchenko', role: 'Organizer · Dynatrace', photo: organizerVlad },
    { name: 'Andrei Tazetdinov', role: 'GDG Organizer · Dynatrace', photo: speakerPhoto },
  ]
  return (
    <ContentSlide eyebrow="Welcome" title="Organizers" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex items-center justify-center h-full gap-10">
        {organizers.map((o) => (
          <div key={o.name} className="flex flex-col items-center gap-3">
            <img
              src={o.photo}
              alt={o.name}
              className="w-32 h-32 rounded-xl object-cover border border-[#e5e7eb]"
            />
            <div className="text-[16px] font-semibold text-[#111827] text-center">{o.name}</div>
            <div className="text-[12px] text-[#4b5563] text-center">{o.role}</div>
          </div>
        ))}
      </div>
    </ContentSlide>
  )
}

function Slide00cPastEvents({ slideNumber }: SlideProps) {
  const events = [
    { title: "Today: Build with AI — AI Agents Workshop", photo: eventUpcoming },
    { title: 'DevFest Linz: Great AI Hackathon', photo: eventDevfest },
  ]
  return (
    <ContentSlide eyebrow="Welcome" title="GDG Linz in action" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex items-center justify-center h-full gap-8">
        {events.map((e) => (
          <div key={e.title} className="flex flex-col items-center gap-3">
            <img
              src={e.photo}
              alt={e.title}
              className="w-[280px] h-[280px] rounded-xl object-cover border border-[#e5e7eb]"
            />
            <div className="text-[14px] text-[#374151] text-center max-w-[280px]">{e.title}</div>
          </div>
        ))}
      </div>
    </ContentSlide>
  )
}

// ─── INTRO ───────────────────────────────────────────────────────────────────

function Slide01Title({ slideNumber }: SlideProps) {
  return (
    <TitleSlide
      eyebrow="Workshop · 2026"
      title="Build AI Agents from Scratch"
      subtitle="Google ADK"
      speakerPhoto={speakerPhoto}
      speakerName="Andrei Tazetdinov"
      speakerRole="Dynatrace"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide01aWifi({ slideNumber }: SlideProps) {
  const steps = [
    { img: wifiWelcome, label: '1 · Register' },
    { img: wifiRegister, label: '2 · Fill the form' },
    { img: wifiWaiting, label: '3 · Wait for approval' },
  ]
  return (
    <ContentSlide eyebrow="Housekeeping" title="Wi-Fi access — Dynatrace-Guest" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-[14px] text-[#374151] font-medium text-center max-w-[620px]">
          Join <span className="text-[#2563eb] font-semibold">Dynatrace-Guest</span>, register, and put my email in{' '}
          <span className="text-[#2563eb] font-semibold">"Dynatrace Buddy"</span> — I approve the request on my side.
        </div>
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-center gap-1.5 w-[210px] min-w-0 shrink-0">
                <div className="text-[20px] text-[#4b5563] font-medium w-full text-center leading-tight break-words">{s.label}</div>
                <div className="relative w-[210px] rounded-lg border border-[#d1d5db] shadow-sm overflow-hidden">
                  <img src={s.img} alt={s.label} className="w-full h-auto block" />
                  {i === 1 && (
                    <div
                      className="absolute rounded border-2 border-[#ef4444]"
                      style={{ left: '16%', top: '54.5%', width: '68%', height: '7.5%', boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)' }}
                    />
                  )}
                </div>
                {i === 1 && (
                  <div className="text-[20px] font-semibold text-[#ef4444] w-full text-center leading-tight break-words">
                    ↑ enter my email here
                  </div>
                )}
              </div>
              {i < steps.length - 1 && <div className="text-[24px] text-[#9ca3af] mb-6">→</div>}
            </div>
          ))}
        </div>
        <div className="text-[13px] text-[#4b5563] font-mono">
          Dynatrace buddy email: <span className="text-[#2563eb]">andrei.tazetdinov@dynatrace.com</span>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide01bRawDemo({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Intro · Before any framework" title="From single call to agent loop — no framework" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-start pt-1">
        <div className="flex-1 flex flex-col gap-3">
          <Tag color="#4ade80">Level 1 · single call</Tag>
          <Code>
            {cm('# one prompt → one answer → saved to file')}{'\n'}
            bash examples/00-raw/call.sh{'\n'}
            bash examples/00-raw/call.sh {st('"What is an AI agent?"')}
          </Code>
          <div className="text-[12px] text-[#4b5563]">No loop. No tools. You decide what to do with the answer.</div>
          <div className="w-full h-px bg-[#e5e7eb]" />
          <Tag color="#a78bfa">Level 2 · agent loop</Tag>
          <Code>
            {cm('# model decides → tool → result back → repeat → done')}{'\n'}
            bash examples/00-raw/loop.sh
          </Code>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[12px] text-[#4b5563] uppercase tracking-widest">loop.sh — the cycle</div>
          <Code>
            {kw('for')} turn {kw('in')} $(seq 1 10); {kw('do')}{'\n'}
            {'  '}RESPONSE=$(claude -p {st('"$TOOLS $HISTORY Next:"')}){'\n\n'}
            {'  '}{kw('if')}   done:*       {cm('→ print & exit')}{'\n'}
            {'  '}{kw('elif')} write_data:* {cm('→ echo ... >> data.txt')}{'\n'}
            {'  '}{kw('elif')} read_data    {cm('→ $(cat data.txt)')}{'\n'}
            {'  '}{kw('fi')}{'\n\n'}
            {'  '}HISTORY+={st('"[turn $turn] $RESPONSE"')}{'\n'}
            {kw('done')}
          </Code>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide02WhatIsAgent({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Intro · Part 1" title="Three Levels of LLM Usage" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-4 h-full">
        {/* Level 1 */}
        <div className="flex-1 flex flex-col gap-2 bg-[#f5f7fa] rounded-lg p-4">
          <Tag color="#4ade80">Single Call</Tag>
          <div className="text-[13px] text-[#4b5563] font-medium">Question → answer</div>
          <div className="flex-1 flex flex-col justify-center gap-2 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="bg-[#f0f4f8] rounded px-2 py-1 text-[#374151]">Input</span>
              <span className="text-[#4b5563]">→</span>
              <span className="bg-[#2a5ff5]/30 rounded px-2 py-1 text-[#2563eb]">LLM</span>
              <span className="text-[#4b5563]">→</span>
              <span className="bg-[#f0f4f8] rounded px-2 py-1 text-[#374151]">Answer</span>
            </div>
          </div>
          <div className="text-[12px] text-[#4b5563] leading-5">
            Classification, summarization, data extraction.<br />
            <span className="text-[#4b5563]">You decide what to do with the answer.</span>
          </div>
        </div>
        {/* Level 2 */}
        <div className="flex-1 flex flex-col gap-2 bg-[#f5f7fa] rounded-lg p-4">
          <Tag color="#fbbf24">Workflow</Tag>
          <div className="text-[13px] text-[#4b5563] font-medium">Fixed pipeline</div>
          <div className="flex-1 flex flex-col justify-center gap-2 text-[13px]">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-[#2a5ff5]/30 rounded px-2 py-1 text-[#2563eb]">LLM 1</span>
              <span className="text-[#4b5563]">→</span>
              <span className="bg-[#2a5ff5]/30 rounded px-2 py-1 text-[#2563eb]">LLM 2</span>
              <span className="text-[#4b5563]">→</span>
              <span className="bg-[#2a5ff5]/30 rounded px-2 py-1 text-[#2563eb]">LLM 3</span>
            </div>
          </div>
          <div className="text-[12px] text-[#4b5563] leading-5">
            Step order fixed by <span className="text-[#fbbf24]">your code</span>.<br />
            The model doesn't decide what's next.
          </div>
        </div>
        {/* Level 3 */}
        <div className="flex-1 flex flex-col gap-2 bg-[#2a5ff5]/10 border border-[#2a5ff5]/30 rounded-lg p-4">
          <Tag color="#a78bfa">Agent</Tag>
          <div className="text-[13px] text-[#4b5563] font-medium">Loop until done</div>
          <div className="flex-1 flex flex-col justify-center gap-2 text-[13px]">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-[#a78bfa]/30 rounded px-2 py-1 text-[#7c3aed]">LLM decides</span>
              <span className="text-[#4b5563]">→</span>
              <span className="bg-[#00c4b4]/30 rounded px-2 py-1 text-[#0e7490]">Tool</span>
              <span className="text-[#4b5563]">→</span>
              <span className="text-[#4b5563]">repeat…</span>
            </div>
          </div>
          <div className="text-[12px] text-[#4b5563] leading-5">
            Step order decided by <span className="text-[#a78bfa]">the model</span> each iteration.<br />
            You give the goal and tools — not a script.
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide02bAgentLimits({ slideNumber }: SlideProps) {
  const items = [
    { label: 'Selective Amnesia', desc: 'Forgets the code it already wrote, so it writes it again.' },
    { label: 'Library Aversion', desc: 'Hand-rolls things that already exist as libraries.' },
    { label: 'Deletion Phobia', desc: "Won't delete, so dead code accumulates." },
    { label: 'The Complexity Spiral', desc: 'Patches rather than refactors, so complexity compounds.' },
  ]
  return (
    <ContentSlide eyebrow="Intro · Reality check" title="Four things agents reliably do" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-3 h-full">
        <div className="grid grid-cols-2 gap-3 flex-1">
          {items.map((item) => (
            <div key={item.label} className="bg-[#f5f7fa] rounded-lg p-5 flex flex-col gap-2">
              <div className="text-[13px] font-semibold uppercase tracking-widest text-[#1f2937]">{item.label}</div>
              <div className="text-[13px] text-[#4b5563] font-medium leading-6">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-[#4b5563] text-center leading-4">
          Source: SlopCodeBench by Snorkel AI · agents given sequential feature requests on one codebase, code inspected after every task · these four patterns recurred
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide03AgentLoop({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Intro · Part 1" title="Agent Loop" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-6 h-full justify-center">
        {/* Loop diagram */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#f0f4f8] rounded-lg px-4 py-3 text-[14px] text-[#374151]">User</div>
            <div className="text-[11px] text-[#4b5563]">request</div>
          </div>
          <div className="text-[#2a5ff5] text-xl">→</div>
          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#2a5ff5]/40 border border-[#2a5ff5] rounded-lg px-6 py-3 text-[15px] text-[#111827] font-medium">
              Model decides
            </div>
            <div className="text-[11px] text-[#4b5563]">what's next?</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-[12px] text-[#00c4b4]">needs a tool</div>
            <div className="text-[#00c4b4] text-xl">→</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#00c4b4]/30 border border-[#00c4b4]/50 rounded-lg px-4 py-3 text-[14px] text-[#0e7490]">
              Tool
            </div>
            <div className="text-[11px] text-[#4b5563]">result</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-[12px] text-[#00c4b4]">back</div>
            <div className="text-[#00c4b4] rotate-180 text-xl">→</div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="text-[12px] text-[#16a34a]">answer ready</div>
            <div className="text-[#16a34a] text-xl">↓</div>
            <div className="bg-[#4ade80]/20 border border-[#4ade80]/40 rounded-lg px-6 py-2 text-[14px] text-[#16a34a]">
              Final Answer
            </div>
          </div>
        </div>
        {/* Key components */}
        <div className="flex gap-3">
          {[
            { label: 'Model (LLM)', desc: 'brain, makes decisions', color: '#2a5ff5' },
            { label: 'Instruction', desc: 'behavior contract, not a hint', color: '#a78bfa' },
            { label: 'Tools', desc: 'functions the model can call', color: '#00c4b4' },
            { label: 'Session', desc: 'history and state across iterations', color: '#fbbf24' },
          ].map((c) => (
            <div key={c.label} className="flex-1 bg-[#f8fafc] rounded-lg p-3">
              <div className="text-[12px] font-semibold mb-1" style={{ color: c.color }}>{c.label}</div>
              <div className="text-[11px] text-[#4b5563]">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide04WhyAdk({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Intro · Part 2" title="Why ADK" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-8 h-full items-start pt-2">
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[13px] text-[#4b5563] uppercase tracking-widest mb-1">Without a framework — you reinvent</div>
          {[
            'Parsing model responses (text vs tool call — every provider has its own format)',
            'Storing history and state across iterations (session)',
            'Event stream: what to display while the agent is thinking',
            'Guard against infinite loops',
            'Composing multiple agents together',
          ].map((t) => (
            <Bullet key={t}>{t}</Bullet>
          ))}
        </div>
        <div className="w-px bg-[#f0f4f8] self-stretch" />
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[13px] text-[#4b5563] uppercase tracking-widest mb-1">Google ADK provides ready-made building blocks</div>
          {[
            ['LlmAgent', 'model + instruction + tools'],
            ['Runner', 'runs the loop, emits an event stream (for await)'],
            ['SessionService', 'stores conversation history'],
            ['FunctionTool', 'wraps a function into a model-callable tool'],
            ['SequentialAgent / ParallelAgent', 'compose multiple agents'],
            ['BaseLlm', 'provider abstraction — Gemini, Ollama, and more'],
          ].map(([name, desc]) => (
            <div key={name} className="flex gap-2 items-start text-[14px]">
              <span className="text-[#00c4b4] font-mono shrink-0">{name}</span>
              <span className="text-[#4b5563] font-medium">— {desc}</span>
            </div>
          ))}
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide05Plan({ slideNumber }: SlideProps) {
  const rows = [
    { block: 'Intro', what: 'Agent architecture, ADK, plan', time: '10 min', color: '#4ade80' },
    { block: 'Block 1', what: 'LlmAgent → FunctionTool', time: '25 min', color: '#2a5ff5' },
    { block: 'Block 2', what: 'SequentialAgent — one agent vs many', time: '30 min', color: '#2a5ff5' },
    { block: '── Break ──', what: 'Food, stretch, questions', time: '25 min', color: '#555' },
    { block: 'Block 3', what: 'Lead Finder — real case', time: '30 min', color: '#a78bfa' },
    { block: 'Block 4', what: 'Your Agent — a task from your work', time: '20 min', color: '#fbbf24' },
    { block: 'Close', what: 'planner → data portal → lead-finder → n8n', time: '25 min', color: '#00c4b4' },
  ]
  return (
    <ContentSlide eyebrow="Intro · Part 3" title="Today's Plan" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <div key={r.block} className="flex items-center gap-4 bg-[#f8fafc] rounded px-4 py-2.5">
            <span className="w-36 text-[13px] font-semibold shrink-0" style={{ color: r.color }}>{r.block}</span>
            <span className="flex-1 text-[13px] text-[#374151] font-medium">{r.what}</span>
            <span className="text-[12px] text-[#4b5563] shrink-0">{r.time}</span>
          </div>
        ))}
        <div className="text-right text-[11px] text-[#4b5563] mt-1">total ~2h 45min</div>
      </div>
    </ContentSlide>
  )
}

const REPO_QR_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41" shape-rendering="crispEdges"><path fill="#ffffff" d="M0 0h41v41H0z"/><path stroke="#000000" d="M4 4.5h7m3 0h2m1 0h1m1 0h5m2 0h2m2 0h7M4 5.5h1m5 0h1m1 0h2m2 0h1m1 0h4m1 0h1m1 0h4m1 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m4 0h4m1 0h1m1 0h1m3 0h1m3 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m2 0h2m1 0h4m2 0h2m2 0h3m1 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m1 0h2m3 0h1m2 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m6 0h1m1 0h1m1 0h1m1 0h2m2 0h1m2 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M17 11.5h1m1 0h1m1 0h2m2 0h1m2 0h1M4 12.5h1m1 0h1m1 0h1m1 0h1m2 0h2m2 0h2m2 0h1m3 0h3m4 0h1m2 0h1M4 13.5h1m3 0h1m3 0h1m1 0h4m4 0h1m1 0h2m2 0h4m3 0h2M4 14.5h3m2 0h2m1 0h3m3 0h1m2 0h1m3 0h2m1 0h1m2 0h1m2 0h3M7 15.5h1m1 0h1m2 0h1m1 0h1m1 0h4m1 0h3m1 0h3m4 0h1M5 16.5h1m1 0h2m1 0h1m1 0h1m1 0h1m1 0h1m1 0h4m5 0h4m2 0h1m1 0h2M4 17.5h1m2 0h1m1 0h1m6 0h3m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m4 0h2m1 0h1M4 18.5h1m2 0h2m1 0h1m1 0h1m2 0h1m1 0h2m1 0h3m2 0h1m3 0h1m1 0h6M4 19.5h1m1 0h2m6 0h1m1 0h2m3 0h1m3 0h1m1 0h2m1 0h2m3 0h1M4 20.5h1m2 0h4m5 0h1m2 0h1m1 0h1m1 0h3m2 0h3M5 21.5h4m4 0h1m1 0h1m2 0h1m2 0h2m1 0h1m3 0h4m4 0h1M4 22.5h2m1 0h2m1 0h3m1 0h1m1 0h1m3 0h1m1 0h1m2 0h1m2 0h2m4 0h3M5 23.5h2m1 0h2m7 0h3m1 0h1m2 0h5m1 0h3m2 0h2M4 24.5h1m1 0h1m3 0h1m1 0h2m1 0h1m1 0h1m1 0h2m2 0h3m2 0h3m2 0h1m2 0h1M5 25.5h1m3 0h1m4 0h2m1 0h6m1 0h3m1 0h3m3 0h3M4 26.5h1m2 0h6m6 0h2m3 0h3m2 0h3m2 0h3M5 27.5h1m1 0h1m3 0h1m2 0h4m1 0h1m1 0h1m3 0h2m1 0h1m1 0h1m1 0h1m2 0h1M4 28.5h1m1 0h1m1 0h1m1 0h1m1 0h1m7 0h2m2 0h2m2 0h5M12 29.5h2m1 0h2m3 0h1m4 0h1m2 0h1m3 0h2m1 0h2M4 30.5h7m2 0h1m1 0h4m2 0h1m3 0h1m1 0h2m1 0h1m1 0h1m1 0h3M4 31.5h1m5 0h1m5 0h1m4 0h6m1 0h1m3 0h1m3 0h1M4 32.5h1m1 0h3m1 0h1m1 0h2m2 0h2m4 0h2m1 0h1m2 0h6m1 0h1M4 33.5h1m1 0h3m1 0h1m2 0h1m1 0h3m1 0h1m1 0h2m1 0h1m7 0h1m3 0h1M4 34.5h1m1 0h3m1 0h1m1 0h3m5 0h1m4 0h1m6 0h1m1 0h1m1 0h1M4 35.5h1m5 0h1m2 0h1m2 0h2m1 0h1m1 0h2m1 0h6m2 0h1m2 0h1M4 36.5h7m1 0h1m1 0h1m2 0h2m1 0h2m1 0h3m1 0h4m1 0h5"/></svg>'

function Slide05aRepoLink({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Intro · Setup" title="Get the repo" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center justify-center flex-1 gap-8">
          <div
            className="w-[170px] h-[170px] rounded-lg border border-[#e5e7eb] p-3 shrink-0"
            dangerouslySetInnerHTML={{ __html: REPO_QR_SVG }}
          />
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <div className="text-[13px] text-[#4b5563] uppercase tracking-widest">Clone this before Block 1</div>
            <div className="text-[15px] font-mono text-[#2563eb] break-all leading-6">
              github.com/ataztech910/<wbr />build_ai_agents_workshop_2026
            </div>
            <div className="text-[13px] font-mono text-[#4b5563]">
              short link: <span className="text-[#2563eb]">shorturl.at/ewW6D</span>
            </div>
            <pre className="bg-[#f1f5f9] rounded-lg p-3 text-[11px] leading-5 text-[#1e293b] whitespace-pre-wrap break-all font-mono">
{`git clone https://github.com/ataztech910/build_ai_agents_workshop_2026
cd build_ai_agents_workshop_2026/workshop-files/workshop/workshop
npm install`}
            </pre>
          </div>
        </div>
        <ActivityTimer minutes={10} />
      </div>
    </ContentSlide>
  )
}

function Slide05bPickModel({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Intro · Setup" title="Connecting a model — one line to switch" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-start pt-1">
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[12px] text-[#4b5563] uppercase tracking-widest">Every agent in this workshop uses pickModel()</div>
          <Code compact>
            {kw('function')} pickModel() {'{'}{'\n'}
            {'  '}{kw('return')} {st('"gemini-2.0-flash"')};{'\n'}
            {'  '}{cm('// return new KitanaLlm({ model: "auto" }); // ← Kitana')}{'\n'}
            {'}'}
          </Code>
          <div className="text-[12px] text-[#4b5563] leading-5">
            Uncomment one line to switch provider. Nothing else changes.
          </div>
          <div className="w-full h-px bg-[#e5e7eb]" />
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3 bg-[#f8fafc] rounded-lg px-4 py-2">
              <span className="text-[#fbbf24] font-mono text-[13px] shrink-0 w-24">Gemini</span>
              <div className="text-[13px] text-[#374151] font-medium leading-5">
                Default. Needs <span className="text-[#1f2937] font-mono">GOOGLE_GENAI_API_KEY</span> in <span className="font-mono text-[#1f2937]">.env</span>.<br />
                Copy from <span className="font-mono text-[#1f2937]">.env.example</span> and paste your key.
              </div>
            </div>
            <div className="flex items-start gap-3 bg-[#f8fafc] rounded-lg px-4 py-2">
              <span className="text-[#00c4b4] font-mono text-[13px] shrink-0 w-24">Kitana</span>
              <div className="text-[13px] text-[#374151] font-medium leading-5">
                My own personal project — optional, not required. Uses your Claude CLI subscription or local Ollama.<br />
                Swap the return line — same code, different provider.
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 justify-center">
          <div className="text-[12px] text-[#4b5563] uppercase tracking-widest">Kitana under the hood</div>
          <Code compact>
            {cm('# Claude CLI (subscription, no key):')}{'\n'}
            {kw('new')} {hl('KitanaLlm')}({'{'} model: {st('"auto"')} {'}'}){'\n\n'}
            {cm('# Ollama (local model):')}{'\n'}
            {kw('new')} {hl('KitanaLlm')}({'{'}{'\n'}
            {'  '}model: {st('"auto"')},{'\n'}
            {'  '}models: {'{'} ollama: {st('"llama3.2"')} {'}'}{'\n'}
            {'}'})
          </Code>
          <div className="text-[12px] text-[#4b5563] leading-5">
            Same <span className="font-mono text-[#00c4b4]">BaseLlm</span> interface ADK expects —
            Gemini, Kitana, or anything else plugs in identically. For your own scripts, that's
            ordinary individual use; if you ever ship a tool that routes <em>other people's</em> requests
            through their subscription login, Anthropic's docs ask you to use API-key auth instead.
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide05cGeminiSetup({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Intro · Setup" title="Gemini free tier — 3 steps" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-start pt-1">
        <div className="flex-1 flex flex-col gap-3">
          {([
            { n: '1', label: 'aistudio.google.com', lines: ['Sign in with any Google account.', 'No Cloud billing account needed.'] },
            { n: '2', label: 'Get API key → Create API key', lines: ['Left sidebar → "Get API key" → Create API key.', 'Pick any project. Keep billing disabled.'] },
            { n: '3', label: 'Paste key into .env', lines: ['Copy GOOGLE_GENAI_API_KEY= from .env.example,', 'paste your key. Never commit this file.'] },
          ] as { n: string; label: string; lines: string[] }[]).map((s) => (
            <div key={s.n} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-[#2a5ff5]/30 border border-[#2a5ff5]/50 flex items-center justify-center text-[#2563eb] font-bold text-[13px] shrink-0">{s.n}</div>
              <div>
                <div className="text-[14px] text-[#111827] font-medium leading-5">{s.label}</div>
                {s.lines.map((l) => <div key={l} className="text-[12px] text-[#4b5563] leading-4">{l}</div>)}
              </div>
            </div>
          ))}
          <div className="flex items-start gap-2 bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-lg px-3 py-2">
            <span className="text-[#fbbf24] text-[13px] shrink-0">⚠</span>
            <div className="text-[12px] text-[#4b5563] leading-5">
              <span className="text-[#fbbf24]">Don't enable billing</span> on the project — it permanently removes free-tier access.
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[12px] text-[#4b5563] uppercase tracking-widest">Free tier limits (approximate)</div>
          <div className="flex flex-col gap-1.5">
            {([
              { model: 'gemini-2.0-flash', rpm: '10 RPM', day: '~250 req/day' },
              { model: 'gemini-2.0-flash-lite', rpm: '15 RPM', day: '~1,000 req/day' },
              { model: 'gemini-2.5-pro', rpm: '5 RPM', day: '~100 req/day' },
            ] as { model: string; rpm: string; day: string }[]).map((r) => (
              <div key={r.model} className="flex items-center gap-3 bg-[#f8fafc] rounded px-3 py-1.5">
                <span className="font-mono text-[11px] text-[#374151] flex-1">{r.model}</span>
                <span className="text-[11px] text-[#4b5563]">{r.rpm}</span>
                <span className="text-[11px] text-[#4b5563]">{r.day}</span>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-[#4b5563] leading-4">Check live quotas in AI Studio — limits change over time.</div>
          <div className="text-[12px] text-[#4b5563] uppercase tracking-widest mt-1">.env</div>
          <Code compact>
            {cm('# copy .env.example first, then paste your key')}{'\n'}
            GOOGLE_GENAI_API_KEY={st('AIzaSy...')}
          </Code>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide05dKitanaSetup({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Intro · Setup" title="Kitana — Claude CLI, no API key" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-start pt-1">
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-[#2a5ff5]/30 border border-[#2a5ff5]/50 flex items-center justify-center text-[#2563eb] font-bold text-[13px] shrink-0">1</div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="text-[14px] text-[#111827] font-medium leading-5">Install Claude CLI</div>
              <Code compact>npm install -g @anthropic-ai/claude-code</Code>
              <div className="text-[12px] text-[#4b5563] leading-4">Then run <span className="font-mono text-[#4b5563]">claude</span> once — opens browser, sign in to Claude.ai.</div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-[#2a5ff5]/30 border border-[#2a5ff5]/50 flex items-center justify-center text-[#2563eb] font-bold text-[13px] shrink-0">2</div>
            <div>
              <div className="text-[14px] text-[#111827] font-medium leading-5">@kitana-sdk/adk already in package.json</div>
              <div className="text-[12px] text-[#4b5563] leading-4"><span className="font-mono text-[#4b5563]">npm install</span> in the workshop root covers it. No extra step.</div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-[#2a5ff5]/30 border border-[#2a5ff5]/50 flex items-center justify-center text-[#2563eb] font-bold text-[13px] shrink-0">3</div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="text-[14px] text-[#111827] font-medium leading-5">Switch pickModel() — one line</div>
              <Code compact>
                {cm('// return "gemini-2.0-flash";')}{'\n'}
                {kw('return')} {kw('new')} {hl('KitanaLlm')}({'{'} model: {st('"auto"')} {'}'})
              </Code>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[12px] text-[#4b5563] uppercase tracking-widest">Verify it works</div>
          <Code compact>npm run check-kitana</Code>
          <div className="flex flex-col gap-1 bg-[#111827] rounded-lg px-3 py-2.5 font-mono text-[11px] leading-5">
            <span className="text-white/50">1) Checking Claude CLI...</span>
            <span className="text-[#4ade80]">   ✓ claude 1.x.x</span>
            <span className="text-white/50">2) Running a test prompt...</span>
            <span className="text-[#4ade80]">   ✓ Claude CLI responded: OK</span>
            <span className="text-white/50">{''}</span>
            <span className="text-[#4ade80]">✓ Kitana is ready.</span>
          </div>
          <div className="text-[12px] text-[#4b5563] leading-5">
            Requires a <span className="text-[#374151]">Claude.ai Pro or Max</span> subscription (or Team / Enterprise).
            Free plan does not include CLI access.
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

// ─── BLOCK 1 ─────────────────────────────────────────────────────────────────

function Slide06Block1Section({ slideNumber }: SlideProps) {
  return (
    <SectionSlide
      eyebrow="Block 1 · 25 min"
      title="Your First Agent"
      subtitle="7 min live code → 18 min hands-on"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide06bAdkConcepts({ slideNumber }: SlideProps) {
  const blocks = [
    { name: 'LlmAgent', color: '#2a5ff5', desc: 'Defines who the agent is — name, model, instruction, tools.' },
    { name: 'Runner', color: '#a78bfa', desc: 'Orchestrates the loop: sends messages, triggers tool calls, streams output.' },
    { name: 'SessionService', color: '#00c4b4', desc: 'Stores conversation history so the agent remembers previous turns.' },
    { name: 'Events', color: '#4ade80', desc: 'What runAsync yields — text chunks, tool results, or error messages.' },
  ]
  return (
    <ContentSlide eyebrow="Block 1" title="ADK: 4 building blocks" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-start pt-1">
        <div className="flex-1 flex flex-col gap-2">
          {blocks.map((b) => (
            <div key={b.name} className="flex items-start gap-3 bg-[#f8fafc] rounded-lg px-4 py-2.5">
              <span className="font-mono text-[13px] font-semibold shrink-0 w-36" style={{ color: b.color }}>{b.name}</span>
              <span className="text-[13px] text-[#374151] font-medium leading-5">{b.desc}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[12px] text-[#4b5563] uppercase tracking-widest">How they wire together</div>
          <Code compact>
            {kw('const')} agent = {kw('new')} {hl('LlmAgent')}({'{'} name, model, instruction {'}'});{'\n'}
            {kw('const')} sessions = {kw('new')} {hl('InMemorySessionService')}();{'\n'}
            {kw('const')} runner = {kw('new')} {hl('Runner')}({'{'} agent, appName, sessions {'}'});{'\n\n'}
            {kw('const')} session = {kw('await')} sessions.createSession(...);{'\n\n'}
            {kw('for await')} ({kw('const')} event {kw('of')} runner.{hl('runAsync')}({'{'}{'\n'}
            {'  '}userId, sessionId: session.id, newMessage,{'\n'}
            {'}'})) {'{'}{'\n'}
            {'  '}{cm('// event.content  — text from the model')}{'\n'}
            {'  '}{cm('// event.errorMessage — something went wrong')}{'\n'}
            {'}'}
          </Code>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide07Recipe({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 1" title="Recipe: Any LlmAgent" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full">
        <div className="flex-1 flex flex-col gap-4 justify-center">
          {[
            { n: '1', label: 'Create an agent', desc: 'name, model, instruction' },
            { n: '2', label: 'Send a message', desc: 'newMessage with text' },
            { n: '3', label: 'Run the Runner', desc: 'for await → events → output' },
          ].map((s) => (
            <div key={s.n} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#2a5ff5]/30 border border-[#2a5ff5]/50 flex items-center justify-center text-[#2563eb] font-bold text-[14px] shrink-0">
                {s.n}
              </div>
              <div>
                <div className="text-[15px] text-[#111827] font-medium">{s.label}</div>
                <div className="text-[12px] text-[#4b5563]">{s.desc}</div>
              </div>
            </div>
          ))}
          <div className="mt-2 text-[12px] text-[#4b5563]">
            Same recipe in every agent today — from hello-agent to lead-finder.
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <Code>
            {kw('export const')} agent = {kw('new')} {hl('LlmAgent')}({'{'}{'\n'}
            {'  '}name: {st('"hello"')},{'\n'}
            {'  '}model,{'\n'}
            {'  '}instruction: {st('"You are a friendly assistant."')},{'\n'}
            {'}'});{'\n\n'}
            {cm('// Runner executes the agent loop')}{'\n'}
            {kw('for await')} ({kw('const')} event {kw('of')} runner.runAsync(...){')'} {'{'}{'\n'}
            {'  '}{kw('if')} (event.content?.parts?.[0]?.text) {'{'}{'\n'}
            {'    '}process.stdout.write(event.content.parts[0].text){'\n'}
            {'  '}{'}'}{'\n'}
            {'}'}
          </Code>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide08InstructionContract({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 1" title="instruction — a contract, not a hint" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-center">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-[#f87171]/10 border border-[#f87171]/30 rounded-lg p-4">
            <div className="text-[12px] text-[#dc2626] mb-2 uppercase tracking-widest">Without instruction</div>
            <div className="text-[14px] text-[#4b5563] font-medium leading-6">
              "Hi! How can I help you today?"<br />
              "Sure, I'd be happy to assist..."<br />
              <span className="text-[#4b5563] italic">Generic. Unpredictable. Different every time.</span>
            </div>
          </div>
          <div className="bg-[#4ade80]/10 border border-[#4ade80]/30 rounded-lg p-4">
            <div className="text-[12px] text-[#16a34a] mb-2 uppercase tracking-widest">With instruction</div>
            <div className="text-[14px] text-[#4b5563] font-medium leading-6">
              The agent knows who it is, what it can do, how to respond.<br />
              <span className="text-[#4b5563] italic">Consistent. Predictable. A contract.</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="text-[13px] text-[#4b5563] uppercase tracking-widest">Try it yourself</div>
          <Code>
            {cm('// Step 1: run as-is (instruction is empty)')}{'\n'}
            instruction: {st('""')}{'\n\n'}
            {cm('// Step 2: fill it in and compare the output')}{'\n'}
            instruction: {st('"You are an assistant..."')}
          </Code>
          <div className="text-[13px] text-[#4b5563] font-medium leading-6">
            Without instruction the model behaves like a general-purpose chatbot.<br />
            Instruction is what makes the agent a specialist.
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide08bZod({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 1" title="Zod — describing the shape of data" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-start pt-1">
        <div className="flex-1 flex flex-col gap-4">
          <div className="text-[13px] text-[#4b5563] font-medium leading-6">
            Zod is a TypeScript schema library. You describe what shape your data should have — Zod validates it at runtime and infers the TypeScript types automatically.
          </div>
          <div className="flex flex-col gap-2.5">
            {([
              { label: 'Schema = contract', desc: 'You declare the fields and types once. Zod enforces them.' },
              { label: 'Why ADK needs it', desc: 'FunctionTool converts your Zod schema to JSON Schema and sends it to the model, so the model knows exactly what arguments to pass.' },
              { label: 'Validation before execute', desc: 'When the model calls the tool, ADK validates the arguments against the schema before your function runs.' },
            ] as { label: string; desc: string }[]).map((b) => (
              <div key={b.label} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2a5ff5] mt-2 shrink-0" />
                <div>
                  <span className="text-[13px] text-[#1f2937]">{b.label}</span>
                  <span className="text-[13px] text-[#4b5563]"> — {b.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[12px] text-[#4b5563] uppercase tracking-widest">Types you'll use in this workshop</div>
          <Code compact>
            z.object({'{'} city: z.string() {'}'})  {cm('// object with named fields')}{'\n'}
            z.string()                   {cm('// text value')}{'\n'}
            z.number()                   {cm('// numeric value')}{'\n'}
            z.boolean()                  {cm('// true / false')}{'\n'}
            z.optional(z.string())       {cm('// field can be absent')}{'\n'}
            z.string().describe({st('"the city name"')}) {cm('// hint for the model')}
          </Code>
          <div className="text-[11px] text-[#4b5563] leading-4">
            The <span className="font-mono text-[#4b5563]">.describe()</span> hint goes into the JSON Schema — the model reads it to understand what value to put in that field.
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide09FunctionTool({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 1" title="FunctionTool — give the agent a tool" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full">
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="flex items-center gap-3 text-[13px]">
            <span className="bg-[#f0f4f8] rounded px-3 py-2 text-[#4b5563]">"What's the weather in London?"</span>
            <span className="text-[#2a5ff5]">→</span>
            <span className="bg-[#a78bfa]/30 border border-[#a78bfa]/50 rounded px-3 py-2 text-[#7c3aed]">Model decides</span>
          </div>
          <div className="flex items-center gap-3 text-[13px] pl-8">
            <span className="text-[#00c4b4]">↓ calls</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="bg-[#00c4b4]/20 border border-[#00c4b4]/40 rounded px-3 py-2 text-[#0e7490]">getWeather("London")</span>
            <span className="text-[#00c4b4]">→</span>
            <span className="bg-[#f0f4f8] rounded px-3 py-2 text-[#4b5563]">{'{ tempC: 18, condition: "cloudy" }'}</span>
          </div>
          <div className="flex items-center gap-3 text-[13px] pl-8">
            <span className="text-[#16a34a]">↓ result back to model</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="bg-[#4ade80]/10 border border-[#4ade80]/30 rounded px-3 py-2 text-[#16a34a]">"London: 18°C, cloudy"</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-2">
          <Code compact>
            {kw('const')} weatherTool = {kw('new')} {hl('FunctionTool')}({'{'}{'\n'}
            {'  '}name: {st('"getWeather"')},{'\n'}
            {'  '}description: {st('"Returns weather for a city"')},{'\n'}
            {'  '}parameters: z.object({'{'} {cm('// ← Zod schema')}{'\n'}
            {'    '}city: z.string(),{'\n'}
            {'  '}{'}'},{'\n'}
            {'  '}{kw('execute')}: {kw('async')} ({'{'} city {'}'}) {'=>'} {'{'}{'\n'}
            {'    '}{cm('// TODO: return fake data')}{'\n'}
            {'    '}{kw('return')} {'{'} tempC: 18 {'}'};{'\n'}
            {'  '},{'}'},{'\n'}
            {'}'});{'\n'}
            {cm('// attach to the agent:')}{'\n'}
            tools: [weatherTool],
          </Code>
          <div className="text-[11px] text-[#4b5563] leading-4">
            <span className="font-mono text-[#4b5563]">z.object / z.string</span> — Zod is <span className="text-[#4b5563]">required by ADK</span>: it generates the JSON Schema sent to the model (so the model knows what arguments to pass) and validates them before <span className="font-mono text-[#4b5563]">execute</span> is called. Python ADK uses type hints instead — no Zod there.
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide10WriteBlock1({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 1 · Hands-on" title="Tasks 1.1 and 1.2" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex gap-4">
          <div className="flex-1 bg-[#f5f7fa] rounded-lg p-4 flex flex-col gap-2">
            <Tag color="#2a5ff5">1.1 · hello-agent.ts</Tag>
            <Bullet>Run with empty instruction — see what it outputs</Bullet>
            <Bullet>Fill in instruction and question — compare the difference</Bullet>
          </div>
          <div className="flex-1 bg-[#f5f7fa] rounded-lg p-4 flex flex-col gap-2">
            <Tag color="#00c4b4">1.2 · tool-agent.ts</Tag>
            <Bullet>Write a FunctionTool with fake weather data</Bullet>
            <Bullet>Remove tool from tools:[] — agent will guess. Add it back.</Bullet>
          </div>
        </div>
        <Code>
          {cm('# run')}{'\n'}
          npx tsx examples/01-adk/starter/hello-agent.ts{'\n'}
          npx tsx examples/01-adk/starter/tool-agent.ts{'\n\n'}
          {cm('# stuck > 5 min → check solution/')}{'\n'}
          {cm('# hint: what does the tool return? add console.log before return')}
        </Code>
        <ActivityTimer minutes={18} />
      </div>
    </ContentSlide>
  )
}

// ─── BLOCK 2 ─────────────────────────────────────────────────────────────────

function Slide11Block2Section({ slideNumber }: SlideProps) {
  return (
    <SectionSlide
      eyebrow="Block 2 · 30 min"
      title="Pipeline"
      subtitle="10 min experiment → 5 min live code → 15 min hands-on"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide12OneVsMany({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 2 · Key moment" title="One agent vs many" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-stretch">
        <div className="flex-1 flex flex-col gap-3 bg-[#f87171]/5 border border-[#f87171]/20 rounded-lg p-5">
          <div className="text-[13px] text-[#dc2626] uppercase tracking-widest">Option A — one prompt</div>
          <Code>
            instruction:{'\n'}
            {st('"Find leads + write offers + validate"')}{'\n'}
            {cm('// single LlmAgent does everything')}
          </Code>
          <div className="flex-1 text-[13px] text-[#4b5563] font-medium leading-6">
            The model optimizes ALL tasks at once — and compromises on each.
            The validator can't criticize what it just wrote itself.
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 bg-[#4ade80]/5 border border-[#4ade80]/20 rounded-lg p-5">
          <div className="text-[13px] text-[#16a34a] uppercase tracking-widest">Option B — three agents</div>
          <Code>
            {hl('SequentialAgent')}:{'\n'}
            analyst {ok('→')} copywriter {ok('→')} validator{'\n'}
            {cm('// each optimizes one task')}
          </Code>
          <div className="flex-1 text-[13px] text-[#4b5563] font-medium leading-6">
            Each agent approaches the task fresh.<br />
            <span className="text-[#374151]">
              "A model in one prompt compromises on each task.
              Three agents each optimize a single task."
            </span>
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide13SequentialCode({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 2" title="SequentialAgent — same LlmAgent, different wrapper" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full">
        <div className="flex-1 flex flex-col justify-center">
          <Code compact>
            {kw('const')} researcher = {kw('new')} {hl('LlmAgent')}({'{'}{'\n'}
            {'  '}name: {st('"researcher"')}, model: pickModel(),{'\n'}
            {'  '}instruction: {st('"...return ONLY JSON { facts: [] }"')},{'\n'}
            {'}'});{'\n\n'}
            {kw('const')} editor = {kw('new')} {hl('LlmAgent')}({'{'}{'\n'}
            {'  '}name: {st('"editor"')}, model: pickModel(),{'\n'}
            {'  '}instruction: {st('"Rewrite the facts into one paragraph"')},{'\n'}
            {'}'});{'\n\n'}
            {kw('export const')} agent = {kw('new')} {hl('SequentialAgent')}({'{'}{'\n'}
            {'  '}name: {st('"research-pipeline"')},{'\n'}
            {'  '}subAgents: [researcher, editor],{'\n'}
            {'}'});
          </Code>
        </div>
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="flex flex-col gap-3">
            <Bullet>Each sub-agent is a plain <span className="text-[#00c4b4] font-mono">LlmAgent</span>, the same as in Block 1</Bullet>
            <Bullet><span className="text-[#a78bfa] font-mono">SequentialAgent</span> only defines the order and pipes one output into the next</Bullet>
            <Bullet>Strict JSON in the researcher instruction — the contract between agents. Editor depends on that format.</Bullet>
            <Bullet><span className="text-[#fbbf24] font-mono">pickModel()</span> — same provider toggle as in Block 1</Bullet>
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide14WriteBlock2({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 2 · Hands-on" title="Task 1.3 — SequentialAgent" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-3 h-full">
        <div className="flex gap-3">
          <div className="flex-1 bg-[#f5f7fa] rounded-lg p-3 flex flex-col gap-1.5">
            <Tag color="#a78bfa">researcher</Tag>
            <div className="text-[13px] text-[#4b5563] font-medium">receives topic</div>
            <div className="text-[13px] text-[#00c4b4] font-mono">{'→ { "facts": ["...", "...", "..."] }'}</div>
            <div className="text-[12px] text-[#4b5563]">strict JSON, no surrounding text</div>
          </div>
          <div className="flex-1 bg-[#f5f7fa] rounded-lg p-3 flex flex-col gap-1.5">
            <Tag color="#4ade80">editor</Tag>
            <div className="text-[13px] text-[#4b5563] font-medium">receives facts</div>
            <div className="text-[13px] text-[#00c4b4] font-mono">→ one paragraph in prose</div>
          </div>
        </div>
        <Code>
          npx tsx examples/01-adk/starter/sequential.ts {st('"quantum computers"')}{'\n'}
          {cm('# → [researcher] { "facts": [...] }')}{'\n'}
          {cm('# → [editor] "Quantum computers..."')}
        </Code>
        <div className="text-[12px] text-[#4b5563]">
          Bonus (1.4): ParallelAgent — both agents at the same time, measure with console.time
        </div>
        <ActivityTimer minutes={15} />
      </div>
    </ContentSlide>
  )
}

// ─── BLOCK 3 ─────────────────────────────────────────────────────────────────

function Slide15Block3Section({ slideNumber }: SlideProps) {
  return (
    <SectionSlide
      eyebrow="Block 3 · 30 min"
      title="Lead Finder"
      subtitle="8 min live demo → 17 min hands-on → 5 min adk web"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide16LeadFinderArch({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 3" title="Same architecture — new data" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-start pt-2">
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="text-[13px] text-[#4b5563] mb-1">Not new architecture — the same SequentialAgent from Block 2, three agents instead of two</div>
          <div className="flex flex-col gap-2">
            {[
              { name: 'analyst', role: 'picks top-3 leads by ICP from comments', color: '#2a5ff5' },
              { name: 'copywriter', role: 'writes a personalized offer for each', color: '#a78bfa' },
              { name: 'validator', role: 'rejects templated ones, rewrites them', color: '#00c4b4' },
            ].map((a, i) => (
              <div key={a.name} className="flex items-center gap-3">
                {i > 0 && <div className="w-4 text-[#4b5563] text-center">↓</div>}
                {i === 0 && <div className="w-4" />}
                <div
                  className="rounded-lg px-4 py-2 text-[13px] font-mono shrink-0"
                  style={{ background: a.color + '22', border: `1px solid ${a.color}44`, color: a.color }}
                >
                  [{a.name}]
                </div>
                <div className="text-[13px] text-[#4b5563] font-medium">{a.role}</div>
              </div>
            ))}
          </div>
          <div className="text-[12px] text-[#4b5563] mt-2">
            outputKey + {'{'}topLeads{'}'} in instruction — agents pass data via state, not the full conversation history
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 justify-center">
          <div className="text-[13px] text-[#4b5563] uppercase tracking-widest mb-1">New in this block</div>
          <Bullet>
            <span className="text-[#fbbf24]">pickComments()</span> — same toggle pattern as pickModel().<br />
            One variant = FAKE_COMMENTS, other = real API
          </Bullet>
          <Bullet>ICP — your ideal customer. Change it and run again — different leads from the same comments</Bullet>
          <Bullet>
            Real platforms work too (Telegram/YouTube/Reddit, official APIs) — same shape as the portal,
            — this is real, unstaged output from a live channel, pulled during prep for this workshop: <span className="italic">"great news"</span>
          </Bullet>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide17DemoChecklist({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 3 · Live demo" title="What we're watching" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-4 h-full justify-center max-w-xl">
        {[
          { n: '1', text: 'Run on FAKE_COMMENTS — see [analyst] → [copywriter] → [validator]' },
          { n: '2', text: 'Uncomment the portal fetch in pickComments()' },
          { n: '3', text: 'Run the same command — same three agents, but real leads in the output' },
        ].map((s) => (
          <div key={s.n} className="flex gap-4 items-start bg-[#f8fafc] rounded-lg px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-[#2a5ff5]/30 flex items-center justify-center text-[#2563eb] font-bold text-[13px] shrink-0">
              {s.n}
            </div>
            <div className="text-[14px] text-[#374151] font-medium leading-6">{s.text}</div>
          </div>
        ))}
        <div className="text-[13px] text-[#4b5563] font-medium mt-2">
          Result: leads_result.json a second time — about different, real people. Not a line changed in the three agents.
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide18WriteBlock3({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 3 · Hands-on" title="Task 2.1 — Lead Finder pipeline" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-3 h-full">
        <div className="flex gap-3">
          {[
            { step: 'Step 1', desc: "Add only analyst, run with empty instruction — you'll see prose instead of JSON", color: '#f87171' },
            { step: 'Step 2', desc: 'Fill in instruction with the JSON contract — run again, see the difference', color: '#fbbf24' },
            { step: 'Step 3', desc: 'Add copywriter and validator, confirm leads_result.json is saved', color: '#4ade80' },
          ].map((s) => (
            <div key={s.step} className="flex-1 bg-[#f8fafc] rounded-lg p-3 flex flex-col gap-1">
              <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: s.color }}>{s.step}</div>
              <div className="text-[12px] text-[#374151] font-medium leading-5">{s.desc}</div>
            </div>
          ))}
        </div>
        <Code>
          npx tsx examples/02-api/starter/lead-finder.ts{'\n'}
          {cm('# → [analyst] { "top_leads": [...] }')}{'\n'}
          {cm('# → [copywriter] { "offers": [...] }')}{'\n'}
          {cm('# → [validator] { "offers": [...] }')}{'\n'}
          {cm('# → 💾 Saved: leads_result.json')}
        </Code>
        <div className="text-[12px] text-[#4b5563]">
          Experiment: change ICP and run again — different people from the same comments
        </div>
        <ActivityTimer minutes={17} />
      </div>
    </ContentSlide>
  )
}

function Slide19AdkWeb({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 3 · adk web" title="Agent graph in the browser" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-center">
        <div className="flex-1 flex flex-col gap-4">
          <Code>
            npx adk web examples/02-api/starter{'\n'}
            {cm('# → http://localhost:8000')}
          </Code>
          <div className="flex flex-col gap-3">
            <Bullet>You see the graph: analyst → copywriter → validator</Bullet>
            <Bullet>Run a query — watch how validator actually rejects and rewrites a templated offer</Bullet>
            <Bullet><span className="text-[#fbbf24]">Agent behaving strangely — this is your first debugging stop</span></Bullet>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-3">
          <div className="bg-[#f5f7fa] rounded-lg p-4 text-[13px] text-[#4b5563] font-medium leading-6">
            adk web = the same agent behind an HTTP endpoint.<br />
            In Close, n8n will hit exactly this endpoint — no new code, same agent.
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

// ─── BLOCK 4 ─────────────────────────────────────────────────────────────────

function Slide20Block4Section({ slideNumber }: SlideProps) {
  return (
    <SectionSlide
      eyebrow="Block 4 · 20 min"
      title="Your Own Agent"
      subtitle="15 min write from scratch → 5 min show & tell"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide21OwnAgentAssignment({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 4" title="Assignment" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-5 pt-2">
        <div className="text-center py-4 bg-[#f5f7fa] rounded-xl border border-[#e5e7eb]">
          <div className="text-[22px] text-[#111827] font-medium leading-relaxed">
            Take a task from your work<br />that you do manually.<br />
            <span className="text-[#2a5ff5]">Write an agent.</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-[12px] text-[#4b5563] uppercase tracking-widest">How to pick a task</div>
            <Bullet>Recurring, not one-off</Bullet>
            <Bullet>Clear input and expected output</Bullet>
            <Bullet>Narrow — small enough to fit in 15 minutes</Bullet>
            <div className="text-[12px] text-[#4b5563] mt-2">
              Stuck? "Three things I do manually every week and hate."
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-[12px] text-[#4b5563] uppercase tracking-widest">Your toolkit</div>
            <div className="text-[14px] font-mono text-[#2a5ff5]">LlmAgent</div>
            <div className="text-[13px] text-[#4b5563] font-medium -mt-1">model + instruction — enough for most tasks</div>
            <div className="text-[14px] font-mono text-[#00c4b4] mt-1">FunctionTool</div>
            <div className="text-[13px] text-[#4b5563] font-medium -mt-1">if the agent needs an external tool</div>
            <div className="text-[14px] font-mono text-[#a78bfa] mt-1">SequentialAgent</div>
            <div className="text-[13px] text-[#4b5563] font-medium -mt-1">if the task splits into clear steps</div>
          </div>
        </div>
        <Code>
          cp examples/01-adk/starter/hello-agent.ts examples/my-agent.ts{'\n'}
          npx tsx examples/my-agent.ts
        </Code>
      </div>
    </ContentSlide>
  )
}

function Slide22WriteBlock4({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 4 · Hands-on" title="Your Agent — 15 minutes" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-5 h-full justify-center">
        <div className="text-[15px] text-[#4b5563] font-medium leading-7">
          No skeleton. No instructions. No right answer.<br />
          Just your task and what you already know.
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-[#f8fafc] rounded-lg p-4 text-[13px] text-[#4b5563] font-medium leading-6">
            <span className="text-[#1f2937]">Helping frame the task</span> matters more than helping with code.
            The facilitator helps find the right input/output — not syntax.
          </div>
          <div className="flex-1 bg-[#f8fafc] rounded-lg p-4 text-[13px] text-[#4b5563] font-medium leading-6">
            <span className="text-[#1f2937]">pickModel()</span> works the same as everywhere —
            one line to switch the provider.
          </div>
        </div>
        <ActivityTimer minutes={15} />
      </div>
    </ContentSlide>
  )
}

// ─── CLOSE ───────────────────────────────────────────────────────────────────

function Slide23CloseSection({ slideNumber }: SlideProps) {
  return (
    <SectionSlide
      eyebrow="Close · 25 min"
      title="Real Conditions"
      subtitle="What you built — now runs without a single click"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide24ClosePipeline({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Close" title="Orchestration via n8n" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-4 h-full justify-center">
        <div className="flex flex-col gap-1 items-start">
          {[
            { label: 'planner', desc: 'decides which channel to scan (new LlmAgent)', color: '#2a5ff5', tag: 'presenter-only' },
            { label: 'data portal', desc: 'returns real comments from the chosen channel', color: '#fbbf24', tag: 'Block 3' },
            { label: 'lead-finder', desc: 'analyst → copywriter → validator', color: '#a78bfa', tag: 'Block 3 ← you wrote this' },
            { label: 'n8n', desc: 'Sort → Set — groups and formats the final list', color: '#00c4b4', tag: 'orchestration' },
          ].map((s, i) => (
            <div key={s.label} className="flex flex-col items-start w-full">
              {i > 0 && <div className="text-[#4b5563] ml-5 text-lg leading-4">↓</div>}
              <div className="flex items-center gap-3 bg-[#f5f7fa] rounded-lg px-4 py-2.5 w-full">
                <span className="font-mono text-[14px] shrink-0" style={{ color: s.color }}>[{s.label}]</span>
                <span className="text-[13px] text-[#4b5563] font-medium flex-1">{s.desc}</span>
                <span className="text-[11px] bg-white/5 px-2 py-0.5 rounded text-[#4b5563]">{s.tag}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[13px] text-[#4b5563] font-medium mt-1">
          Two independent ADK agents behind two HTTP endpoints (adk web). n8n calls both in sequence — orchestration in n8n, not new TypeScript code.
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide25PlannerSlide({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Close" title="planner — the same LlmAgent" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-center">
        <div className="flex-1">
          <Code>
            {kw('export const')} agent = {kw('new')} {hl('LlmAgent')}({'{'}{'\n'}
            {'  '}name: {st('"planner"')},{'\n'}
            {'  '}model: pickModel(),{'\n'}
            {'  '}instruction: {st('`Given a business description,')}{'\n'}
            {'             '}{st("pick ONE channel: startups / smallbiz / productivity.`")},{'\n'}
            {'}'});{'\n\n'}
            {cm('// n8n calls it over HTTP:')}{'\n'}
            {cm('// POST http://localhost:8001/run')}{'\n'}
            {cm("// → { channel: 'smallbiz', reason: '...' }")}
          </Code>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <Bullet>
            Same recipe as hello-agent.ts at the start — model, instruction, everything.
          </Bullet>
          <Bullet>
            It's called by <span className="text-[#00c4b4]">not a human in the terminal</span>, but n8n over HTTP.
          </Bullet>
          <Bullet>
            The model decides what to do next — picks the channel rather than just processing what it was given. That's an agent.
          </Bullet>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide26N8nDemo({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Close · Live demo" title="n8n: nodes lighting up one by one" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-4 h-full justify-center max-w-xl">
        {[
          { n: '1', text: 'Execute Workflow — both adk web servers are already up and warmed' },
          { n: '2', text: 'planner picks channel → portal delivers data → lead-finder runs 3 agents → n8n sorts' },
          { n: '3', text: 'Final list — the same mechanics the participants just wrote by hand, without a single click' },
        ].map((s) => (
          <div key={s.n} className="flex gap-4 items-start bg-[#f8fafc] rounded-lg px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-[#00c4b4]/20 border border-[#00c4b4]/40 flex items-center justify-center text-[#0e7490] font-bold text-[13px] shrink-0">
              {s.n}
            </div>
            <div className="text-[14px] text-[#374151] font-medium leading-6">{s.text}</div>
          </div>
        ))}
        <div className="bg-[#f5f7fa] rounded-lg p-4 text-[14px] text-[#4b5563] font-medium leading-6 italic mt-2">
          "None of this is new code — planner is the same LlmAgent as everything today,
          lead-finder is what you just built."
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide27Question({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Close" title="Question for the room" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col h-full items-center justify-center gap-8">
        <div className="text-center bg-[#f5f7fa] rounded-xl border border-[#e5e7eb] px-12 py-8">
          <div className="text-[20px] text-[#111827] font-medium leading-8">
            What would you automate first<br />
            <span className="text-[#2a5ff5]">with a pipeline like this behind an HTTP endpoint?</span>
          </div>
        </div>
        <div className="text-[14px] text-[#4b5563] font-medium">
          Quick round: go around the room, briefly — <em>"What surprised you?"</em>
        </div>
      </div>
    </ContentSlide>
  )
}

// ─── SLIDE REGISTRY ───────────────────────────────────────────────────────────

export const EXAMPLE_SLIDES: SlideDef[] = [
  // Intro (0–6)
  { Component: Slide00aCommunity },
  { Component: Slide00aaAbout },
  { Component: Slide00bOrganizers },
  { Component: Slide00cPastEvents },
  { Component: Slide01Title },
  { Component: Slide01aWifi },
  { Component: Slide02WhatIsAgent },
  { Component: Slide02bAgentLimits },
  { Component: Slide01bRawDemo },
  { Component: Slide03AgentLoop },
  { Component: Slide04WhyAdk },
  { Component: Slide05Plan },
  { Component: Slide05aRepoLink },
  { Component: Slide05bPickModel },
  { Component: Slide05cGeminiSetup },
  { Component: Slide05dKitanaSetup },
  // Block 1 (6–11)
  { Component: Slide06Block1Section },
  { Component: Slide06bAdkConcepts },
  { Component: Slide07Recipe },
  { Component: Slide08InstructionContract },
  { Component: Slide08bZod },
  { Component: Slide09FunctionTool },
  { Component: Slide10WriteBlock1 },
  // Block 2 (10–14)
  { Component: Slide11Block2Section },
  { Component: Slide12OneVsMany },
  { Component: Slide13SequentialCode },
  { Component: Slide14WriteBlock2 },
  // Block 3 (14–19)
  { Component: Slide15Block3Section },
  { Component: Slide16LeadFinderArch },
  { Component: Slide17DemoChecklist },
  { Component: Slide18WriteBlock3 },
  { Component: Slide19AdkWeb },
  // Block 4 (19–22)
  { Component: Slide20Block4Section },
  { Component: Slide21OwnAgentAssignment },
  { Component: Slide22WriteBlock4 },
  // Close (22–27)
  { Component: Slide23CloseSection },
  { Component: Slide24ClosePipeline },
  { Component: Slide25PlannerSlide },
  { Component: Slide26N8nDemo },
  { Component: Slide27Question },
]

// Cue points in seconds from talk start (total ~165 min = 9900s)
export const EXAMPLE_CUE_POINTS_SEC = [
  0,     // 00a GDG Linz intro
  20,    // 00aa About (who we are)
  50,    // 00b Organizers
  80,    // 00c Past events
  110,     // 01 Title
  118,    // 01a Wi-Fi access
  130,    // 02 What is agent (three levels — theory first)
  165,    // 02b Agent limits (reality check)
  200,    // 01b Raw demo (claude -p live — after theory)
  260,   // 03 Agent loop
  440,   // 04 Why ADK
  590,   // 05 Plan
  610,   // 05a Repo link (QR code)
  650,   // 05b pickModel — model setup
  670,   // 05c Gemini free tier setup
  690,   // 05d Kitana setup
  710,   // 06 Block 1 section      ← 10 min mark
  770,   // 06b ADK building blocks
  830,   // 07 Recipe (live coding)
  1010,   // 08 instruction = contract (live)
  1070,   // 08b Zod schema intro
  1130,  // 09 FunctionTool (live)
  1310,  // 10 Write Block 1        ← 20 min, 18 min timer
  2390,  // 11 Block 2 section      ← 38 min (10+25+3 buffer)
  2510,  // 12 One vs many (experiment)
  3110,  // 13 SequentialAgent code (live, 5 min)
  3410,  // 14 Write Block 2        ← 55 min, 15 min timer
  4310,  // 15 Block 3 section      ← 70 min (after 25-min break)
  4430,  // 16 Lead Finder arch
  4610,  // 17 Demo checklist (live)
  4910,  // 18 Write Block 3        ← 80 min, 17 min timer
  5930,  // 19 adk web              ← 97 min
  6230,  // 20 Block 4 section      ← 102 min
  6350,  // 21 Own agent assignment
  6470,  // 22 Write Block 4        ← 106 min, 15 min timer
  7370,  // 23 Close section        ← 121 min
  7490,  // 24 Pipeline
  7610,  // 25 Planner
  7790,  // 26 n8n demo
  7910,  // 27 Question             ← 130 min
]
