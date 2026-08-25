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
        {done ? '✓ время вышло' : started ? 'осталось' : 'старт через 1с…'}
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
      subtitle="Google ADK · Kitana · n8n · ~2h 45min"
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
            {cm('# That\'s it. Prompt in → answer out → saved to file.')}
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
          <div className="bg-white/[0.04] rounded-lg px-4 py-3 text-[12px] text-white/30 leading-5">
            Same <span className="text-[#00c4b4] font-mono">claude</span> CLI that powers Kitana —
            so if you switched to Kitana in Block 1, this already worked under the hood.
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide02WhatIsAgent({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Intro · Part 1" title="Три уровня работы с LLM" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-4 h-full">
        {/* Level 1 */}
        <div className="flex-1 flex flex-col gap-2 bg-white/[0.04] rounded-lg p-4">
          <Tag color="#4ade80">Один вызов</Tag>
          <div className="text-[13px] text-white/50 font-light">Вопрос → ответ</div>
          <div className="flex-1 flex flex-col justify-center gap-2 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="bg-white/10 rounded px-2 py-1 text-white/70">Вход</span>
              <span className="text-white/30">→</span>
              <span className="bg-[#2a5ff5]/30 rounded px-2 py-1 text-[#7dd3fc]">LLM</span>
              <span className="text-white/30">→</span>
              <span className="bg-white/10 rounded px-2 py-1 text-white/70">Ответ</span>
            </div>
          </div>
          <div className="text-[12px] text-white/40 leading-5">
            Классификация, суммаризация, извлечение данных.<br />
            <span className="text-white/60">Ты решаешь, что делать с ответом.</span>
          </div>
        </div>
        {/* Level 2 */}
        <div className="flex-1 flex flex-col gap-2 bg-white/[0.04] rounded-lg p-4">
          <Tag color="#fbbf24">Workflow</Tag>
          <div className="text-[13px] text-white/50 font-light">Фиксированная цепочка</div>
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
            Порядок шагов зафиксирован <span className="text-[#fbbf24]">твоим кодом</span>.<br />
            Модель не решает, что делать дальше.
          </div>
        </div>
        {/* Level 3 */}
        <div className="flex-1 flex flex-col gap-2 bg-[#2a5ff5]/10 border border-[#2a5ff5]/30 rounded-lg p-4">
          <Tag color="#a78bfa">Агент</Tag>
          <div className="text-[13px] text-white/50 font-light">Цикл до завершения</div>
          <div className="flex-1 flex flex-col justify-center gap-2 text-[13px]">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-[#a78bfa]/30 rounded px-2 py-1 text-[#c4b5fd]">LLM решает</span>
              <span className="text-white/30">→</span>
              <span className="bg-[#00c4b4]/30 rounded px-2 py-1 text-[#5eead4]">Tool</span>
              <span className="text-white/30">→</span>
              <span className="text-white/30">повтор…</span>
            </div>
          </div>
          <div className="text-[12px] text-white/40 leading-5">
            Порядок шагов решает <span className="text-[#a78bfa]">модель</span> на каждой итерации.<br />
            Ты даёшь цель и инструменты — не сценарий.
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide03AgentLoop({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Intro · Part 1" title="Цикл агента" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-6 h-full justify-center">
        {/* Loop diagram */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-white/10 rounded-lg px-4 py-3 text-[14px] text-white/70">Пользователь</div>
            <div className="text-[11px] text-white/30">запрос</div>
          </div>
          <div className="text-[#2a5ff5] text-xl">→</div>
          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#2a5ff5]/40 border border-[#2a5ff5] rounded-lg px-6 py-3 text-[15px] text-white font-light">
              Модель решает
            </div>
            <div className="text-[11px] text-white/30">что дальше?</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-[12px] text-[#00c4b4]">нужен инструмент</div>
            <div className="text-[#00c4b4] text-xl">→</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#00c4b4]/30 border border-[#00c4b4]/50 rounded-lg px-4 py-3 text-[14px] text-[#5eead4]">
              Инструмент
            </div>
            <div className="text-[11px] text-white/30">результат</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-[12px] text-[#00c4b4]">обратно</div>
            <div className="text-[#00c4b4] rotate-180 text-xl">→</div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="text-[12px] text-[#4ade80]">готов ответ</div>
            <div className="text-[#4ade80] text-xl">↓</div>
            <div className="bg-[#4ade80]/20 border border-[#4ade80]/40 rounded-lg px-6 py-2 text-[14px] text-[#4ade80]">
              Финальный ответ
            </div>
          </div>
        </div>
        {/* Key components */}
        <div className="flex gap-3">
          {[
            { label: 'Модель (LLM)', desc: 'мозг, принимает решения', color: '#2a5ff5' },
            { label: 'Инструкция', desc: 'контракт поведения, не подсказка', color: '#a78bfa' },
            { label: 'Инструменты', desc: 'функции, которые модель может вызвать', color: '#00c4b4' },
            { label: 'Сессия', desc: 'история и состояние между итерациями', color: '#fbbf24' },
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
    <ContentSlide eyebrow="Intro · Part 2" title="Почему ADK" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-8 h-full items-start pt-2">
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[13px] text-white/40 uppercase tracking-widest mb-1">Без фреймворка — переизобретаешь</div>
          {[
            'Парсинг ответа модели (текст vs вызов инструмента — у каждого провайдера свой формат)',
            'Хранение истории и состояния между итерациями (session)',
            'Поток событий: что показывать пока агент думает',
            'Защита от бесконечного цикла',
            'Композиция нескольких агентов друг с другом',
          ].map((t) => (
            <Bullet key={t}>{t}</Bullet>
          ))}
        </div>
        <div className="w-px bg-white/10 self-stretch" />
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[13px] text-white/40 uppercase tracking-widest mb-1">Google ADK даёт готовые кирпичи</div>
          {[
            ['LlmAgent', 'модель + инструкция + инструменты'],
            ['Runner', 'исполняет цикл, отдаёт поток событий (for await)'],
            ['SessionService', 'хранит историю диалога'],
            ['FunctionTool', 'оборачивает функцию в инструмент, понятный модели'],
            ['SequentialAgent / ParallelAgent', 'композиция нескольких агентов'],
            ['BaseLlm', 'абстракция провайдера — Gemini, Kitana, Ollama'],
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
    { block: 'Вступление', what: 'Архитектура агента, ADK, план', time: '10 мин', color: '#4ade80' },
    { block: 'Block 1', what: 'LlmAgent → FunctionTool', time: '25 мин', color: '#2a5ff5' },
    { block: 'Block 2', what: 'SequentialAgent — один агент vs несколько', time: '30 мин', color: '#2a5ff5' },
    { block: '── Перерыв ──', what: 'Еда, разминка, вопросы', time: '25 мин', color: '#555' },
    { block: 'Block 3', what: 'Lead Finder — реальный кейс', time: '30 мин', color: '#a78bfa' },
    { block: 'Block 4', what: 'Свой агент — задача из твоей работы', time: '20 мин', color: '#fbbf24' },
    { block: 'Закрытие', what: 'planner → data portal → lead-finder → n8n', time: '25 мин', color: '#00c4b4' },
  ]
  return (
    <ContentSlide eyebrow="Intro · Part 3" title="Что делаем сегодня" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <div key={r.block} className="flex items-center gap-4 bg-white/[0.03] rounded px-4 py-2.5">
            <span className="w-36 text-[13px] font-semibold shrink-0" style={{ color: r.color }}>{r.block}</span>
            <span className="flex-1 text-[13px] text-white/70 font-light">{r.what}</span>
            <span className="text-[12px] text-white/30 shrink-0">{r.time}</span>
          </div>
        ))}
        <div className="text-right text-[11px] text-white/25 mt-1">итого ~2ч45</div>
      </div>
    </ContentSlide>
  )
}

// ─── BLOCK 1 ─────────────────────────────────────────────────────────────────

function Slide06Block1Section({ slideNumber }: SlideProps) {
  return (
    <SectionSlide
      eyebrow="Block 1 · 25 мин"
      title="Your First Agent"
      subtitle="7 мин live-код → 18 мин пишете сами"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide07Recipe({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 1" title="Рецепт: любой LlmAgent" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full">
        <div className="flex-1 flex flex-col gap-4 justify-center">
          {[
            { n: '1', label: 'Создать агента', desc: 'name, model, instruction' },
            { n: '2', label: 'Задать вопрос', desc: 'newMessage с текстом' },
            { n: '3', label: 'Запустить Runner', desc: 'for await → события → вывод' },
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
            Этот же рецепт — в каждом агенте сегодня, от hello-agent до lead-finder.
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <Code>
            {kw('export const')} agent = {kw('new')} {hl('LlmAgent')}({'{'}{'\n'}
            {'  '}name: {st('"hello"')},{'\n'}
            {'  '}model,{'\n'}
            {'  '}instruction: {st('"You are a friendly assistant."')},{'\n'}
            {'}'});{'\n\n'}
            {cm('// Runner исполняет цикл агента')}{'\n'}
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
    <ContentSlide eyebrow="Block 1" title="instruction — контракт, не подсказка" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-center">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-[#f87171]/10 border border-[#f87171]/30 rounded-lg p-4">
            <div className="text-[12px] text-[#f87171] mb-2 uppercase tracking-widest">Без instruction</div>
            <div className="text-[14px] text-white/60 font-light leading-6">
              "Hi! How can I help you today?"<br />
              "Sure, I'd be happy to assist..."<br />
              <span className="text-white/30 italic">Generic. Непредсказуемый. Каждый раз разный.</span>
            </div>
          </div>
          <div className="bg-[#4ade80]/10 border border-[#4ade80]/30 rounded-lg p-4">
            <div className="text-[12px] text-[#4ade80] mb-2 uppercase tracking-widest">С instruction</div>
            <div className="text-[14px] text-white/60 font-light leading-6">
              Агент знает кто он, что умеет, как отвечать.<br />
              <span className="text-white/30 italic">Консистентный. Предсказуемый. Контракт.</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="text-[13px] text-white/40 uppercase tracking-widest">Попробуй сам</div>
          <Code>
            {cm('// Шаг 1: запусти как есть (instruction пустая)')}{'\n'}
            instruction: {st('""')}{'\n\n'}
            {cm('// Шаг 2: заполни и сравни ответ')}{'\n'}
            instruction: {st('"Ты помощник..."')}
          </Code>
          <div className="text-[13px] text-white/50 font-light leading-6">
            Без инструкции модель ведёт себя как "general-purpose chatbot".<br />
            Instruction — это то, что делает агента специалистом.
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide09FunctionTool({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 1" title="FunctionTool — даём агенту инструмент" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full">
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="flex items-center gap-3 text-[13px]">
            <span className="bg-white/10 rounded px-3 py-2 text-white/60">"Какая погода в Москве?"</span>
            <span className="text-[#2a5ff5]">→</span>
            <span className="bg-[#a78bfa]/30 border border-[#a78bfa]/50 rounded px-3 py-2 text-[#c4b5fd]">Модель решает</span>
          </div>
          <div className="flex items-center gap-3 text-[13px] pl-8">
            <span className="text-[#00c4b4]">↓ вызывает</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="bg-[#00c4b4]/20 border border-[#00c4b4]/40 rounded px-3 py-2 text-[#5eead4]">getWeather("Москва")</span>
            <span className="text-[#00c4b4]">→</span>
            <span className="bg-white/10 rounded px-3 py-2 text-white/60">{'{ tempC: 18, condition: "cloudy" }'}</span>
          </div>
          <div className="flex items-center gap-3 text-[13px] pl-8">
            <span className="text-[#4ade80]">↓ результат обратно модели</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="bg-[#4ade80]/10 border border-[#4ade80]/30 rounded px-3 py-2 text-[#86efac]">"В Москве 18°C и облачно"</span>
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
            {'  '}{kw('execute')}: {kw('async')} ({'{'} city {'}'}) => {'{'}{'\n'}
            {'    '}{cm('// TODO: вернуть фейковые данные')}{'\n'}
            {'    '}{kw('return')} {'{'} tempC: 18 {'}'};{'\n'}
            {'  '},{'}'},{'\n'}
            {'}'});{'\n\n'}
            {kw('export const')} agent = {kw('new')} {hl('LlmAgent')}({'{'}{'\n'}
            {'  '}...{'\n'}
            {'  '}tools: [weatherTool], {cm('// ← подключаем')}{'\n'}
            {'}'});
          </Code>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide10WriteBlock1({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 1 · Пишете сами" title="Задания 1.1 и 1.2" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex gap-4">
          <div className="flex-1 bg-white/[0.04] rounded-lg p-4 flex flex-col gap-2">
            <Tag color="#2a5ff5">1.1 · hello-agent.ts</Tag>
            <Bullet>Запусти с пустой instruction — посмотри что выдаёт</Bullet>
            <Bullet>Заполни instruction и вопрос — сравни разницу</Bullet>
          </div>
          <div className="flex-1 bg-white/[0.04] rounded-lg p-4 flex flex-col gap-2">
            <Tag color="#00c4b4">1.2 · tool-agent.ts</Tag>
            <Bullet>Напиши FunctionTool с фейковой погодой</Bullet>
            <Bullet>Убери tool из tools:[] — агент придумает сам. Верни обратно.</Bullet>
          </div>
        </div>
        <Code>
          {cm('# запуск')}{'\n'}
          npx tsx examples/01-adk/starter/hello-agent.ts{'\n'}
          npx tsx examples/01-adk/starter/tool-agent.ts{'\n\n'}
          {cm('# застрял > 5 мин → смотри solution/')}{'\n'}
          {cm('# подсказка: что возвращает инструмент? добавь console.log перед return')}
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
      eyebrow="Block 2 · 30 мин"
      title="Pipeline"
      subtitle="10 мин эксперимент → 5 мин live-код → 15 мин пишете сами"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide12OneVsMany({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 2 · Ключевой момент" title="Один агент vs несколько" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-stretch">
        <div className="flex-1 flex flex-col gap-3 bg-[#f87171]/5 border border-[#f87171]/20 rounded-lg p-5">
          <div className="text-[13px] text-[#f87171] uppercase tracking-widest">Вариант A — один промпт</div>
          <Code>
            instruction:{'\n'}
            {st('"Найди лидов + напиши офферы + проверь"')}{'\n'}
            {cm('// один LlmAgent делает всё')}
          </Code>
          <div className="flex-1 text-[13px] text-white/50 font-light leading-6">
            Модель оптимизирует ВСЕ задачи сразу — идёт на компромисс по каждой.
            Валидатор не критикует то, что только что написал сам.
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 bg-[#4ade80]/5 border border-[#4ade80]/20 rounded-lg p-5">
          <div className="text-[13px] text-[#4ade80] uppercase tracking-widest">Вариант B — три агента</div>
          <Code>
            {hl('SequentialAgent')}:{'\n'}
            analyst {ok('→')} copywriter {ok('→')} validator{'\n'}
            {cm('// каждый оптимизирует одну задачу')}
          </Code>
          <div className="flex-1 text-[13px] text-white/50 font-light leading-6">
            Каждый агент видит задачу свежим взглядом.<br />
            <span className="text-white/70">
              "Модель в одном промпте идёт на компромисс по каждой задаче.
              Три агента оптимизируют каждую задачу отдельно."
            </span>
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide13SequentialCode({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 2" title="SequentialAgent — тот же LlmAgent, другая обёртка" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full">
        <div className="flex-1 flex flex-col justify-center">
          <Code>
            {kw('const')} researcher = {kw('new')} {hl('LlmAgent')}({'{'}{'\n'}
            {'  '}name: {st('"researcher"')}, model: pickModel(),{'\n'}
            {'  '}instruction: {st('"...возвращай ТОЛЬКО JSON { facts: [] }"')},{'\n'}
            {'}'});{'\n\n'}
            {kw('const')} editor = {kw('new')} {hl('LlmAgent')}({'{'}{'\n'}
            {'  '}name: {st('"editor"')}, model: pickModel(),{'\n'}
            {'  '}instruction: {st('"Перепиши факты в один абзац"')},{'\n'}
            {'}'});{'\n\n'}
            {kw('export const')} agent = {kw('new')} {hl('SequentialAgent')}({'{'}{'\n'}
            {'  '}name: {st('"research-pipeline"')},{'\n'}
            {'  '}subAgents: [researcher, editor],{'\n'}
            {'}'});
          </Code>
        </div>
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="flex flex-col gap-3">
            <Bullet>Каждый суб-агент — обычный <span className="text-[#00c4b4] font-mono">LlmAgent</span>, тот же, что в Block 1</Bullet>
            <Bullet><span className="text-[#a78bfa] font-mono">SequentialAgent</span> только определяет порядок и прокидывает вывод одного в следующий</Bullet>
            <Bullet>Строгий JSON в инструкции исследователя — контракт между агентами. Редактор зависит от этого формата.</Bullet>
            <Bullet><span className="text-[#fbbf24] font-mono">pickModel()</span> — тот же тумблер провайдера, что и в Block 1</Bullet>
          </div>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide14WriteBlock2({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 2 · Пишете сами" title="Задание 1.3 — SequentialAgent" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex gap-4">
          <div className="flex-1 bg-white/[0.04] rounded-lg p-4 flex flex-col gap-2">
            <Tag color="#a78bfa">researcher</Tag>
            <div className="text-[13px] text-white/60 font-light">принимает тему</div>
            <div className="text-[13px] text-[#00c4b4] font-mono">{'→ { "facts": ["...", "...", "..."] }'}</div>
            <div className="text-[12px] text-white/30">строго JSON, никакого текста вокруг</div>
          </div>
          <div className="flex-1 bg-white/[0.04] rounded-lg p-4 flex flex-col gap-2">
            <Tag color="#4ade80">editor</Tag>
            <div className="text-[13px] text-white/60 font-light">принимает факты</div>
            <div className="text-[13px] text-[#00c4b4] font-mono">→ один абзац прозой</div>
          </div>
        </div>
        <Code>
          npx tsx examples/01-adk/starter/sequential.ts {st('"квантовые компьютеры"')}{'\n'}
          {cm('# → [researcher] { "facts": [...] }')}{'\n'}
          {cm('# → [editor] "Квантовые компьютеры..."')}
        </Code>
        <div className="text-[12px] text-white/30">
          Бонус (1.4): ParallelAgent — оба агента одновременно, замерь время через console.time
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
      eyebrow="Block 3 · 30 мин"
      title="Lead Finder"
      subtitle="8 мин live-демо → 17 мин пишете сами → 5 мин adk web"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide16LeadFinderArch({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 3" title="Та же архитектура — новые данные" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-start pt-2">
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="text-[13px] text-white/40 mb-1">Не новая архитектура — тот же SequentialAgent из Block 2, три агента вместо двух</div>
          <div className="flex flex-col gap-2">
            {[
              { name: 'analyst', role: 'выбирает топ-3 лида по ICP из комментариев', color: '#2a5ff5' },
              { name: 'copywriter', role: 'пишет персональный оффер для каждого', color: '#a78bfa' },
              { name: 'validator', role: 'отклоняет шаблонные, переписывает', color: '#00c4b4' },
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
          <div className="text-[13px] text-white/40 uppercase tracking-widest mb-1">Ново в этом блоке</div>
          <Bullet>
            <span className="text-[#fbbf24]">pickComments()</span> — тот же toggle-паттерн что и pickModel().<br />
            Один вариант = FAKE_COMMENTS, другой = реальный API
          </Bullet>
          <Bullet>ICP — твой идеальный клиент. Поменяй и запусти снова — другие лиды из тех же комментариев</Bullet>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide17DemoChecklist({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 3 · Live демо" title="Что смотрим" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-4 h-full justify-center max-w-xl">
        {[
          { n: '1', text: 'Запустить на FAKE_COMMENTS — видим [analyst] → [copywriter] → [validator]' },
          { n: '2', text: 'Раскомментировать fetch к порталу в pickComments()' },
          { n: '3', text: 'Запустить ту же команду — те же три агента, но в выводе реальные лиды' },
        ].map((s) => (
          <div key={s.n} className="flex gap-4 items-start bg-white/[0.03] rounded-lg px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-[#2a5ff5]/30 flex items-center justify-center text-[#7dd3fc] font-bold text-[13px] shrink-0">
              {s.n}
            </div>
            <div className="text-[14px] text-white/70 font-light leading-6">{s.text}</div>
          </div>
        ))}
        <div className="text-[13px] text-white/30 font-light mt-2">
          Итог: leads_result.json во второй раз — про других, настоящих людей. В трёх агентах не поменялось ничего.
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide18WriteBlock3({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 3 · Пишете сами" title="Задание 2.1 — Lead Finder пайплайн" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-3 h-full">
        <div className="flex gap-3">
          {[
            { step: 'Шаг 1', desc: 'Добавь только analyst, запусти с пустой instruction — увидишь прозу вместо JSON', color: '#f87171' },
            { step: 'Шаг 2', desc: 'Заполни instruction с JSON-контрактом — запусти снова, увидишь разницу', color: '#fbbf24' },
            { step: 'Шаг 3', desc: 'Допиши copywriter и validator, убедись что сохраняется leads_result.json', color: '#4ade80' },
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
          Эксперимент: поменяй ICP и запусти снова — другие люди из тех же комментариев
        </div>
        <ActivityTimer minutes={17} />
      </div>
    </ContentSlide>
  )
}

function Slide19AdkWeb({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 3 · adk web" title="Граф агентов в браузере" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-center">
        <div className="flex-1 flex flex-col gap-4">
          <Code>
            npx adk web examples/02-api/starter{'\n'}
            {cm('# → http://localhost:8000')}
          </Code>
          <div className="flex flex-col gap-3">
            <Bullet>Видишь граф: analyst → copywriter → validator</Bullet>
            <Bullet>Прогони запрос — смотри как validator реально отклоняет и переписывает шаблонный оффер</Bullet>
            <Bullet><span className="text-[#fbbf24]">Агент ведёт себя странно — сюда смотришь первым делом</span></Bullet>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-3">
          <div className="bg-white/[0.04] rounded-lg p-4 text-[13px] text-white/50 font-light leading-6">
            adk web = тот же агент за HTTP-эндпоинтом.<br />
            В Закрытии n8n будет дёргать именно этот эндпоинт — не новый код, тот же агент.
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
      eyebrow="Block 4 · 20 мин"
      title="Your Own Agent"
      subtitle="15 мин пишете с нуля → 5 мин показываем"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide21OwnAgentAssignment({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Block 4" title="Задание" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-6 h-full justify-center">
        <div className="text-center py-6 bg-white/[0.04] rounded-xl border border-white/10">
          <div className="text-[22px] text-white font-light leading-relaxed">
            Возьми задачу из своей работы,<br />которую делаешь руками.<br />
            <span className="text-[#2a5ff5]">Напиши агента.</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-[12px] text-white/30 uppercase tracking-widest">Как выбрать задачу</div>
            <Bullet>Повторяющаяся, не разовая</Bullet>
            <Bullet>Чёткий вход и ожидаемый выход</Bullet>
            <Bullet>Узкая — чтобы уместиться в 15 минут</Bullet>
            <div className="text-[12px] text-white/30 mt-2">
              Застрял? "Три вещи, которые делаю руками каждую неделю и ненавижу."
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-[12px] text-white/30 uppercase tracking-widest">В арсенале</div>
            <div className="text-[14px] font-mono text-[#2a5ff5]">LlmAgent</div>
            <div className="text-[13px] text-white/40 font-light -mt-1">модель + инструкция — для большинства задач достаточно</div>
            <div className="text-[14px] font-mono text-[#00c4b4] mt-1">FunctionTool</div>
            <div className="text-[13px] text-white/40 font-light -mt-1">если нужен внешний инструмент</div>
            <div className="text-[14px] font-mono text-[#a78bfa] mt-1">SequentialAgent</div>
            <div className="text-[13px] text-white/40 font-light -mt-1">если задача делится на понятные шаги</div>
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
    <ContentSlide eyebrow="Block 4 · Пишете сами" title="Свой агент — 15 минут" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-5 h-full justify-center">
        <div className="text-[15px] text-white/60 font-light leading-7">
          Нет скелета. Нет задания. Нет правильного ответа.<br />
          Только твоя задача и то, что уже умеешь.
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-white/[0.03] rounded-lg p-4 text-[13px] text-white/50 font-light leading-6">
            <span className="text-white/80">Помощь с формулировкой задачи</span> важнее помощи с кодом.
            Фасилитатор поможет найти правильный вход/выход — не синтаксис.
          </div>
          <div className="flex-1 bg-white/[0.03] rounded-lg p-4 text-[13px] text-white/50 font-light leading-6">
            <span className="text-white/80">pickModel()</span> работает так же, как везде —
            одна строка чтобы переключить провайдера.
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
      eyebrow="Close · 25 мин"
      title="Real Conditions"
      subtitle="То, что построили — теперь работает без единого клика"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Slide24ClosePipeline({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Close" title="Оркестрация через n8n" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-4 h-full justify-center">
        <div className="flex flex-col gap-1 items-start">
          {[
            { label: 'planner', desc: 'решает какой канал сканировать (новый LlmAgent)', color: '#2a5ff5', tag: 'presenter-only' },
            { label: 'data portal', desc: 'отдаёт реальные комментарии из выбранного канала', color: '#fbbf24', tag: 'Block 3' },
            { label: 'lead-finder', desc: 'analyst → copywriter → validator', color: '#a78bfa', tag: 'Block 3 ← ты это написал' },
            { label: 'n8n', desc: 'Sort → Set — группирует и форматирует финальный список', color: '#00c4b4', tag: 'оркестрация' },
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
          Два независимых ADK-агента за двумя HTTP-эндпоинтами (adk web). n8n дёргает оба по очереди — оркестрация в n8n, не новый TypeScript-код.
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide25PlannerSlide({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Close" title="planner — тот же LlmAgent" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex gap-6 h-full items-center">
        <div className="flex-1">
          <Code>
            {kw('export const')} agent = {kw('new')} {hl('LlmAgent')}({'{'}{'\n'}
            {'  '}name: {st('"planner"')},{'\n'}
            {'  '}model: pickModel(),{'\n'}
            {'  '}instruction: {st('`Given a business description,')}{'\n'}
            {'             '}{st("pick ONE channel: startups / smallbiz / productivity.`")},{'\n'}
            {'}'});{'\n\n'}
            {cm('// n8n вызывает его по HTTP:')}{'\n'}
            {cm('// POST http://localhost:8001/run')}{'\n'}
            {cm("// → { channel: 'smallbiz', reason: '...' }")}
          </Code>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <Bullet>
            Тот же рецепт, что и hello-agent.ts в самом начале — model, instruction, всё.
          </Bullet>
          <Bullet>
            Его вызывает <span className="text-[#00c4b4]">не человек через терминал</span>, а n8n через HTTP.
          </Bullet>
          <Bullet>
            Модель решает что делать дальше — выбирает канал, а не просто обрабатывает то что дали. Это и есть агент.
          </Bullet>
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide26N8nDemo({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Close · Live демо" title="n8n: подсветка нод одна за другой" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-4 h-full justify-center max-w-xl">
        {[
          { n: '1', text: 'Execute Workflow — оба adk web сервера уже подняты и прогреты' },
          { n: '2', text: 'planner выбирает канал → портал отдаёт данные → lead-finder гоняет 3 агентов → n8n сортирует' },
          { n: '3', text: 'Итоговый список — та же механика, что участники только что писали руками, без единого клика' },
        ].map((s) => (
          <div key={s.n} className="flex gap-4 items-start bg-white/[0.03] rounded-lg px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-[#00c4b4]/20 border border-[#00c4b4]/40 flex items-center justify-center text-[#5eead4] font-bold text-[13px] shrink-0">
              {s.n}
            </div>
            <div className="text-[14px] text-white/70 font-light leading-6">{s.text}</div>
          </div>
        ))}
        <div className="bg-white/[0.04] rounded-lg p-4 text-[14px] text-white/60 font-light leading-6 italic mt-2">
          "Ничего из этого не новый код — planner такой же LlmAgent, как и всё сегодня,
          lead-finder — то, что вы только что построили."
        </div>
      </div>
    </ContentSlide>
  )
}

function Slide27Question({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Close" title="Вопрос залу" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col h-full items-center justify-center gap-8">
        <div className="text-center bg-white/[0.04] rounded-xl border border-white/10 px-12 py-8">
          <div className="text-[20px] text-white font-light leading-8">
            Что бы вы автоматизировали первым,<br />
            <span className="text-[#2a5ff5]">будь у вас такой пайплайн за HTTP-эндпоинтом?</span>
          </div>
        </div>
        <div className="text-[14px] text-white/30 font-light">
          Быстрый круг: по кругу, коротко — <em>"Что удивило?"</em>
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
