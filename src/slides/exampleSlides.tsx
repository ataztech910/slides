import { useEffect, useState } from 'react'
import type { SlideDef, SlideProps } from '../engine/types'
import { Code, ContentSlide, SectionSlide, TitleSlide, kw, st, cm, hl, ok } from '../engine/primitives'

const FOOTER = 'Build AI Agents · 2026'

// ─── shared helpers ──────────────────────────────────────────────────────────

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start text-[16px] text-white/80 font-light leading-snug">
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
    <div className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-2.5">
      <span className="text-[13px] text-white/50 font-light shrink-0">
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

// ─── INTRO ───────────────────────────────────────────────────────────────────

function Slide01Title({ slideNumber }: SlideProps) {
  return (
    <TitleSlide
      eyebrow="Workshop · 2026"
      title="Build AI Agents from Scratch"
      subtitle="Google ADK · n8n · ~2h 45min"
      speakerName="Andrei Tazetdinov"
      speakerRole="Dynatrace"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide01bRawDemo({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Intro · Before any framework" title="The simplest possible call" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-center">
        <div className="flex-1 flex flex-col gap-5 justify-center">
          <Code>
            {cm('# Run this right now in your terminal')}{'\n'}
            {cm('# No API key. No setup. Just claude -p.')}{'\n\n'}
            bash examples/00-raw/call.sh{'\n\n'}
            {cm('# Or pass your own question:')}{'\n'}
            bash examples/00-raw/call.sh {st('"What is an AI agent?"')}
          </Code>
          <Code>
            {cm('# What the script does — 3 lines:')}{'\n'}
            {kw('claude')} -p {st('"What is an AI agent? One sentence."')} {'\n'}
            {'  '}| tee answer.txt{'\n\n'}
            {cm("# That's it. Prompt in → answer out → saved to file.")}
          </Code>
        </div>
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="text-[14px] text-white/60 font-light leading-7">
            This is <span className="text-[#4ade80] font-semibold">Level 1</span> — a single call.<br />
            No session. No tools. No loop.<br />
            You decide what to do with the answer.
          </div>
          <div className="w-full h-px bg-white/10" />
          <div className="text-[13px] text-white/40 font-light leading-6">
            ADK doesn't change this call.<br />
            It wraps a <span className="text-[#a78bfa]">loop</span> around it:<br />
            model decides → tool call → result back → repeat<br />
            until the model says it's done.
          </div>
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
        <div className="flex-1 flex flex-col gap-2 bg-white/[0.04] rounded-lg p-4">
          <Tag color="#4ade80">Single Call</Tag>
          <div className="text-[13px] text-white/50 font-light">Question → answer</div>
          <div className="flex-1 flex flex-col justify-center gap-2 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="bg-white/10 rounded px-2 py-1 text-white/70">Input</span>
              <span className="text-white/30">→</span>
              <span className="bg-[#2a5ff5]/30 rounded px-2 py-1 text-[#7dd3fc]">LLM</span>
              <span className="text-white/30">→</span>
              <span className="bg-white/10 rounded px-2 py-1 text-white/70">Answer</span>
            </div>
          </div>
          <div className="text-[12px] text-white/40 leading-5">
            Classification, summarization, data extraction.<br />
            <span className="text-white/60">You decide what to do with the answer.</span>
          </div>
        </div>
        {/* Level 2 */}
        <div className="flex-1 flex flex-col gap-2 bg-white/[0.04] rounded-lg p-4">
          <Tag color="#fbbf24">Workflow</Tag>
          <div className="text-[13px] text-white/50 font-light">Fixed pipeline</div>
          <div className="flex-1 flex flex-col justify-center gap-2 text-[13px]">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-[#2a5ff5]/30 rounded px-2 py-1 text-[#7dd3fc]">LLM 1</span>
              <span className="text-white/30">→</span>
              <span className="bg-[#2a5ff5]/30 rounded px-2 py-1 text-[#7dd3fc]">LLM 2</span>
              <span className="text-white/30">→</span>
              <span className="bg-[#2a5ff5]/30 rounded px-2 py-1 text-[#7dd3fc]">LLM 3</span>
            </div>
          </div>
          <div className="text-[12px] text-white/40 leading-5">
            Step order fixed by <span className="text-[#fbbf24]">your code</span>.<br />
            The model doesn't decide what's next.
          </div>
        </div>
        {/* Level 3 */}
        <div className="flex-1 flex flex-col gap-2 bg-[#2a5ff5]/10 border border-[#2a5ff5]/30 rounded-lg p-4">
          <Tag color="#a78bfa">Agent</Tag>
          <div className="text-[13px] text-white/50 font-light">Loop until done</div>
          <div className="flex-1 flex flex-col justify-center gap-2 text-[13px]">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-[#a78bfa]/30 rounded px-2 py-1 text-[#c4b5fd]">LLM decides</span>
              <span className="text-white/30">→</span>
              <span className="bg-[#00c4b4]/30 rounded px-2 py-1 text-[#5eead4]">Tool</span>
              <span className="text-white/30">→</span>
              <span className="text-white/30">repeat…</span>
            </div>
          </div>
          <div className="text-[12px] text-white/40 leading-5">
            Step order decided by <span className="text-[#a78bfa]">the model</span> each iteration.<br />
            You give the goal and tools — not a script.
          </div>
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
            <div className="bg-white/10 rounded-lg px-4 py-3 text-[14px] text-white/70">User</div>
            <div className="text-[11px] text-white/30">request</div>
          </div>
          <div className="text-[#2a5ff5] text-xl">→</div>
          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#2a5ff5]/40 border border-[#2a5ff5] rounded-lg px-6 py-3 text-[15px] text-white font-light">
              Model decides
            </div>
            <div className="text-[11px] text-white/30">what's next?</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-[12px] text-[#00c4b4]">needs a tool</div>
            <div className="text-[#00c4b4] text-xl">→</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#00c4b4]/30 border border-[#00c4b4]/50 rounded-lg px-4 py-3 text-[14px] text-[#5eead4]">
              Tool
            </div>
            <div className="text-[11px] text-white/30">result</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-[12px] text-[#00c4b4]">back</div>
            <div className="text-[#00c4b4] rotate-180 text-xl">→</div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="text-[12px] text-[#4ade80]">answer ready</div>
            <div className="text-[#4ade80] text-xl">↓</div>
            <div className="bg-[#4ade80]/20 border border-[#4ade80]/40 rounded-lg px-6 py-2 text-[14px] text-[#4ade80]">
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
            <div key={c.label} className="flex-1 bg-white/[0.03] rounded-lg p-3">
              <div className="text-[12px] font-semibold mb-1" style={{ color: c.color }}>{c.label}</div>
              <div className="text-[11px] text-white/40">{c.desc}</div>
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
          <div className="text-[13px] text-white/40 uppercase tracking-widest mb-1">Without a framework — you reinvent</div>
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
        <div className="w-px bg-white/10 self-stretch" />
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[13px] text-white/40 uppercase tracking-widest mb-1">Google ADK provides ready-made building blocks</div>
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
              <span className="text-white/50 font-light">— {desc}</span>
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
          <div key={r.block} className="flex items-center gap-4 bg-white/[0.03] rounded px-4 py-2.5">
            <span className="w-36 text-[13px] font-semibold shrink-0" style={{ color: r.color }}>{r.block}</span>
            <span className="flex-1 text-[13px] text-white/70 font-light">{r.what}</span>
            <span className="text-[12px] text-white/30 shrink-0">{r.time}</span>
          </div>
        ))}
        <div className="text-right text-[11px] text-white/25 mt-1">total ~2h 45min</div>
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
              <div className="w-8 h-8 rounded-full bg-[#2a5ff5]/30 border border-[#2a5ff5]/50 flex items-center justify-center text-[#7dd3fc] font-bold text-[14px] shrink-0">
                {s.n}
              </div>
              <div>
                <div className="text-[15px] text-white font-light">{s.label}</div>
                <div className="text-[12px] text-white/40">{s.desc}</div>
              </div>
            </div>
          ))}
          <div className="mt-2 text-[12px] text-white/30">
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
            <div className="text-[12px] text-[#f87171] mb-2 uppercase tracking-widest">Without instruction</div>
            <div className="text-[14px] text-white/60 font-light leading-6">
              "Hi! How can I help you today?"<br />
              "Sure, I'd be happy to assist..."<br />
              <span className="text-white/30 italic">Generic. Unpredictable. Different every time.</span>
            </div>
          </div>
          <div className="bg-[#4ade80]/10 border border-[#4ade80]/30 rounded-lg p-4">
            <div className="text-[12px] text-[#4ade80] mb-2 uppercase tracking-widest">With instruction</div>
            <div className="text-[14px] text-white/60 font-light leading-6">
              The agent knows who it is, what it can do, how to respond.<br />
              <span className="text-white/30 italic">Consistent. Predictable. A contract.</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="text-[13px] text-white/40 uppercase tracking-widest">Try it yourself</div>
          <Code>
            {cm('// Step 1: run as-is (instruction is empty)')}{'\n'}
            instruction: {st('""')}{'\n\n'}
            {cm('// Step 2: fill it in and compare the output')}{'\n'}
            instruction: {st('"You are an assistant..."')}
          </Code>
          <div className="text-[13px] text-white/50 font-light leading-6">
            Without instruction the model behaves like a general-purpose chatbot.<br />
            Instruction is what makes the agent a specialist.
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
            <span className="bg-white/10 rounded px-3 py-2 text-white/60">"What's the weather in London?"</span>
            <span className="text-[#2a5ff5]">→</span>
            <span className="bg-[#a78bfa]/30 border border-[#a78bfa]/50 rounded px-3 py-2 text-[#c4b5fd]">Model decides</span>
          </div>
          <div className="flex items-center gap-3 text-[13px] pl-8">
            <span className="text-[#00c4b4]">↓ calls</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="bg-[#00c4b4]/20 border border-[#00c4b4]/40 rounded px-3 py-2 text-[#5eead4]">getWeather("London")</span>
            <span className="text-[#00c4b4]">→</span>
            <span className="bg-white/10 rounded px-3 py-2 text-white/60">{'{ tempC: 18, condition: "cloudy" }'}</span>
          </div>
          <div className="flex items-center gap-3 text-[13px] pl-8">
            <span className="text-[#4ade80]">↓ result back to model</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="bg-[#4ade80]/10 border border-[#4ade80]/30 rounded px-3 py-2 text-[#86efac]">"London: 18°C, cloudy"</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <Code>
            {kw('const')} weatherTool = {kw('new')} {hl('FunctionTool')}({'{'}{'\n'}
            {'  '}name: {st('"getWeather"')},{'\n'}
            {'  '}description: {st('"Returns weather for a city"')},{'\n'}
            {'  '}parameters: z.object({'{'}{'\n'}
            {'    '}city: z.string(),{'\n'}
            {'  '}{'}'},{'\n'}
            {'  '}{kw('execute')}: {kw('async')} ({'{'} city {'}'}) {'=>'} {'{'}{'\n'}
            {'    '}{cm('// TODO: return fake data')}{'\n'}
            {'    '}{kw('return')} {'{'} tempC: 18 {'}'};{'\n'}
            {'  '},{'}'},{'\n'}
            {'}'});{'\n\n'}
            {kw('export const')} agent = {kw('new')} {hl('LlmAgent')}({'{'}{'\n'}
            {'  '}...{'\n'}
            {'  '}tools: [weatherTool], {cm('// ← attach')}{'\n'}
            {'}'});
          </Code>
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
          <div className="flex-1 bg-white/[0.04] rounded-lg p-4 flex flex-col gap-2">
            <Tag color="#2a5ff5">1.1 · hello-agent.ts</Tag>
            <Bullet>Run with empty instruction — see what it outputs</Bullet>
            <Bullet>Fill in instruction and question — compare the difference</Bullet>
          </div>
          <div className="flex-1 bg-white/[0.04] rounded-lg p-4 flex flex-col gap-2">
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
          <div className="text-[13px] text-[#f87171] uppercase tracking-widest">Option A — one prompt</div>
          <Code>
            instruction:{'\n'}
            {st('"Find leads + write offers + validate"')}{'\n'}
            {cm('// single LlmAgent does everything')}
          </Code>
          <div className="flex-1 text-[13px] text-white/50 font-light leading-6">
            The model optimizes ALL tasks at once — and compromises on each.
            The validator can't criticize what it just wrote itself.
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 bg-[#4ade80]/5 border border-[#4ade80]/20 rounded-lg p-5">
          <div className="text-[13px] text-[#4ade80] uppercase tracking-widest">Option B — three agents</div>
          <Code>
            {hl('SequentialAgent')}:{'\n'}
            analyst {ok('→')} copywriter {ok('→')} validator{'\n'}
            {cm('// each optimizes one task')}
          </Code>
          <div className="flex-1 text-[13px] text-white/50 font-light leading-6">
            Each agent approaches the task fresh.<br />
            <span className="text-white/70">
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
          <Code>
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
      <div className="flex flex-col gap-4 h-full">
        <div className="flex gap-4">
          <div className="flex-1 bg-white/[0.04] rounded-lg p-4 flex flex-col gap-2">
            <Tag color="#a78bfa">researcher</Tag>
            <div className="text-[13px] text-white/60 font-light">receives topic</div>
            <div className="text-[13px] text-[#00c4b4] font-mono">{'→ { "facts": ["...", "...", "..."] }'}</div>
            <div className="text-[12px] text-white/30">strict JSON, no surrounding text</div>
          </div>
          <div className="flex-1 bg-white/[0.04] rounded-lg p-4 flex flex-col gap-2">
            <Tag color="#4ade80">editor</Tag>
            <div className="text-[13px] text-white/60 font-light">receives facts</div>
            <div className="text-[13px] text-[#00c4b4] font-mono">→ one paragraph in prose</div>
          </div>
        </div>
        <Code>
          npx tsx examples/01-adk/starter/sequential.ts {st('"quantum computers"')}{'\n'}
          {cm('# → [researcher] { "facts": [...] }')}{'\n'}
          {cm('# → [editor] "Quantum computers..."')}
        </Code>
        <div className="text-[12px] text-white/30">
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
          <div className="text-[13px] text-white/40 mb-1">Not new architecture — the same SequentialAgent from Block 2, three agents instead of two</div>
          <div className="flex flex-col gap-2">
            {[
              { name: 'analyst', role: 'picks top-3 leads by ICP from comments', color: '#2a5ff5' },
              { name: 'copywriter', role: 'writes a personalized offer for each', color: '#a78bfa' },
              { name: 'validator', role: 'rejects templated ones, rewrites them', color: '#00c4b4' },
            ].map((a, i) => (
              <div key={a.name} className="flex items-center gap-3">
                {i > 0 && <div className="w-4 text-white/20 text-center">↓</div>}
                {i === 0 && <div className="w-4" />}
                <div
                  className="rounded-lg px-4 py-2 text-[13px] font-mono shrink-0"
                  style={{ background: a.color + '22', border: `1px solid ${a.color}44`, color: a.color }}
                >
                  [{a.name}]
                </div>
                <div className="text-[13px] text-white/50 font-light">{a.role}</div>
              </div>
            ))}
          </div>
          <div className="text-[12px] text-white/30 mt-2">
            outputKey + {'{'}topLeads{'}'} in instruction — agents pass data via state, not the full conversation history
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 justify-center">
          <div className="text-[13px] text-white/40 uppercase tracking-widest mb-1">New in this block</div>
          <Bullet>
            <span className="text-[#fbbf24]">pickComments()</span> — same toggle pattern as pickModel().<br />
            One variant = FAKE_COMMENTS, other = real API
          </Bullet>
          <Bullet>ICP — your ideal customer. Change it and run again — different leads from the same comments</Bullet>
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
          <div key={s.n} className="flex gap-4 items-start bg-white/[0.03] rounded-lg px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-[#2a5ff5]/30 flex items-center justify-center text-[#7dd3fc] font-bold text-[13px] shrink-0">
              {s.n}
            </div>
            <div className="text-[14px] text-white/70 font-light leading-6">{s.text}</div>
          </div>
        ))}
        <div className="text-[13px] text-white/30 font-light mt-2">
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
            <div key={s.step} className="flex-1 bg-white/[0.03] rounded-lg p-3 flex flex-col gap-1">
              <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: s.color }}>{s.step}</div>
              <div className="text-[12px] text-white/55 font-light leading-5">{s.desc}</div>
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
        <div className="text-[12px] text-white/30">
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
          <div className="bg-white/[0.04] rounded-lg p-4 text-[13px] text-white/50 font-light leading-6">
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
        <div className="text-center py-4 bg-white/[0.04] rounded-xl border border-white/10">
          <div className="text-[22px] text-white font-light leading-relaxed">
            Take a task from your work<br />that you do manually.<br />
            <span className="text-[#2a5ff5]">Write an agent.</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-[12px] text-white/30 uppercase tracking-widest">How to pick a task</div>
            <Bullet>Recurring, not one-off</Bullet>
            <Bullet>Clear input and expected output</Bullet>
            <Bullet>Narrow — small enough to fit in 15 minutes</Bullet>
            <div className="text-[12px] text-white/30 mt-2">
              Stuck? "Three things I do manually every week and hate."
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-[12px] text-white/30 uppercase tracking-widest">Your toolkit</div>
            <div className="text-[14px] font-mono text-[#2a5ff5]">LlmAgent</div>
            <div className="text-[13px] text-white/40 font-light -mt-1">model + instruction — enough for most tasks</div>
            <div className="text-[14px] font-mono text-[#00c4b4] mt-1">FunctionTool</div>
            <div className="text-[13px] text-white/40 font-light -mt-1">if the agent needs an external tool</div>
            <div className="text-[14px] font-mono text-[#a78bfa] mt-1">SequentialAgent</div>
            <div className="text-[13px] text-white/40 font-light -mt-1">if the task splits into clear steps</div>
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
        <div className="text-[15px] text-white/60 font-light leading-7">
          No skeleton. No instructions. No right answer.<br />
          Just your task and what you already know.
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-white/[0.03] rounded-lg p-4 text-[13px] text-white/50 font-light leading-6">
            <span className="text-white/80">Helping frame the task</span> matters more than helping with code.
            The facilitator helps find the right input/output — not syntax.
          </div>
          <div className="flex-1 bg-white/[0.03] rounded-lg p-4 text-[13px] text-white/50 font-light leading-6">
            <span className="text-white/80">pickModel()</span> works the same as everywhere —
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
              {i > 0 && <div className="text-white/20 ml-5 text-lg leading-4">↓</div>}
              <div className="flex items-center gap-3 bg-white/[0.04] rounded-lg px-4 py-2.5 w-full">
                <span className="font-mono text-[14px] shrink-0" style={{ color: s.color }}>[{s.label}]</span>
                <span className="text-[13px] text-white/60 font-light flex-1">{s.desc}</span>
                <span className="text-[11px] bg-white/5 px-2 py-0.5 rounded text-white/30">{s.tag}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[13px] text-white/40 font-light mt-1">
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
          <div key={s.n} className="flex gap-4 items-start bg-white/[0.03] rounded-lg px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-[#00c4b4]/20 border border-[#00c4b4]/40 flex items-center justify-center text-[#5eead4] font-bold text-[13px] shrink-0">
              {s.n}
            </div>
            <div className="text-[14px] text-white/70 font-light leading-6">{s.text}</div>
          </div>
        ))}
        <div className="bg-white/[0.04] rounded-lg p-4 text-[14px] text-white/60 font-light leading-6 italic mt-2">
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
        <div className="text-center bg-white/[0.04] rounded-xl border border-white/10 px-12 py-8">
          <div className="text-[20px] text-white font-light leading-8">
            What would you automate first<br />
            <span className="text-[#2a5ff5]">with a pipeline like this behind an HTTP endpoint?</span>
          </div>
        </div>
        <div className="text-[14px] text-white/30 font-light">
          Quick round: go around the room, briefly — <em>"What surprised you?"</em>
        </div>
      </div>
    </ContentSlide>
  )
}

// ─── SLIDE REGISTRY ───────────────────────────────────────────────────────────

export const EXAMPLE_SLIDES: SlideDef[] = [
  // Intro (0–6)
  { Component: Slide01Title },
  { Component: Slide01bRawDemo },
  { Component: Slide02WhatIsAgent },
  { Component: Slide03AgentLoop },
  { Component: Slide04WhyAdk },
  { Component: Slide05Plan },
  // Block 1 (5–10)
  { Component: Slide06Block1Section },
  { Component: Slide07Recipe },
  { Component: Slide08InstructionContract },
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
  0,     // 01 Title
  20,    // 01b Raw demo (claude -p live)
  90,    // 02 What is agent
  150,   // 03 Agent loop
  330,   // 04 Why ADK
  480,   // 05 Plan
  600,   // 06 Block 1 section      ← 10 min mark
  720,   // 07 Recipe (live coding)
  900,   // 08 instruction = contract (live)
  1020,  // 09 FunctionTool (live)
  1200,  // 10 Write Block 1        ← 20 min, 18 min timer
  2280,  // 11 Block 2 section      ← 38 min (10+25+3 buffer)
  2400,  // 12 One vs many (experiment)
  3000,  // 13 SequentialAgent code (live, 5 min)
  3300,  // 14 Write Block 2        ← 55 min, 15 min timer
  4200,  // 15 Block 3 section      ← 70 min (after 25-min break)
  4320,  // 16 Lead Finder arch
  4500,  // 17 Demo checklist (live)
  4800,  // 18 Write Block 3        ← 80 min, 17 min timer
  5820,  // 19 adk web              ← 97 min
  6120,  // 20 Block 4 section      ← 102 min
  6240,  // 21 Own agent assignment
  6360,  // 22 Write Block 4        ← 106 min, 15 min timer
  7260,  // 23 Close section        ← 121 min
  7380,  // 24 Pipeline
  7500,  // 25 Planner
  7680,  // 26 n8n demo
  7800,  // 27 Question             ← 130 min
]
