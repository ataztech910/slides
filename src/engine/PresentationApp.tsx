import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { SlideDef } from './types'
import { useGamepadControls } from './useGamepadControls'

const COUNTDOWN_START = 3
const OVERDUE_HAPTIC_INTENSITY = 0.8
const OVERDUE_HAPTIC_DURATION_MS = 160

export type PresentationAppProps = {
  slides: SlideDef[]
  /** Total talk length in seconds. Defaults to 2 hours. */
  durationSec?: number
  /**
   * Target timestamp (seconds from start) for each slide, same length/order as `slides`.
   * Drives the progress-bar markers and the "running behind schedule" haptic pulse.
   * Omit to run the timer without per-slide pacing.
   */
  cuePointsSec?: number[]
  /** Render a full-screen overlay instead of the deck — e.g. a live demo, terminal, or browser. */
  renderDemo?: (mode: string, close: () => void) => ReactNode
  /** localStorage key for persisting slide position + timer across reloads. */
  storageKey?: string
}

type PersistedState = {
  slide?: number
  timerStartedAt?: number | null
  pausedElapsedSec?: number
}

function readPersistedState(storageKey: string): PersistedState {
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return {}
    return JSON.parse(saved) as PersistedState
  } catch {
    return {}
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function getElapsedSeconds(
  timerStartedAt: number | null,
  pausedElapsedSec: number,
  durationSec: number,
): number {
  if (!timerStartedAt) return pausedElapsedSec
  const secs = pausedElapsedSec + Math.floor((Date.now() - timerStartedAt) / 1000)
  return Math.min(Math.max(secs, 0), durationSec)
}

export function PresentationApp({
  slides,
  durationSec = 2 * 60 * 60,
  cuePointsSec,
  renderDemo,
  storageKey = 'slides-app-pres-v1',
}: PresentationAppProps) {
  const persistedState = readPersistedState(storageKey)

  const [current, setCurrent] = useState<number>(() => {
    const { slide } = persistedState
    return typeof slide === 'number' ? Math.max(0, Math.min(slides.length - 1, slide)) : 0
  })
  const [demoMode, setDemoMode] = useState<string | null>(null)
  const [timerStartedAt, setTimerStartedAt] = useState<number | null>(() => {
    const { timerStartedAt } = persistedState
    return typeof timerStartedAt === 'number' ? timerStartedAt : null
  })
  const [pausedElapsedSec, setPausedElapsedSec] = useState(() =>
    typeof persistedState.pausedElapsedSec === 'number' ? persistedState.pausedElapsedSec : 0,
  )
  const [elapsed, setElapsed] = useState(() =>
    getElapsedSeconds(
      persistedState.timerStartedAt ?? null,
      typeof persistedState.pausedElapsedSec === 'number' ? persistedState.pausedElapsedSec : 0,
      durationSec,
    ),
  )
  const [countdownValue, setCountdownValue] = useState<number | null>(null)
  const presRef = useRef<HTMLDivElement>(null)
  const countdownTimeoutsRef = useRef<number[]>([])
  const overdueCueRef = useRef(-1)

  const total = slides.length
  const isCountdownRunning = countdownValue !== null
  const isTimerRunning = timerStartedAt !== null
  const isTimerActive = isTimerRunning || pausedElapsedSec > 0
  const displayElapsed = isTimerRunning ? elapsed : pausedElapsedSec

  useEffect(() => {
    return () => {
      countdownTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
      countdownTimeoutsRef.current = []
    }
  }, [])

  const clearCountdown = useCallback(() => {
    countdownTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    countdownTimeoutsRef.current = []
    setCountdownValue(null)
  }, [])

  const startCountdown = useCallback(() => {
    clearCountdown()
    setCountdownValue(COUNTDOWN_START)

    countdownTimeoutsRef.current = [
      window.setTimeout(() => setCountdownValue(2), 1000),
      window.setTimeout(() => setCountdownValue(1), 2000),
      window.setTimeout(() => {
        setCountdownValue(null)
        setPausedElapsedSec(0)
        setElapsed(0)
        setTimerStartedAt(Date.now())
      }, 3000),
    ]
  }, [clearCountdown])

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ slide: current, timerStartedAt, pausedElapsedSec }),
      )
    } catch {
      // Ignore storage write failures in presentation mode.
    }
  }, [current, pausedElapsedSec, storageKey, timerStartedAt])

  // Timer tick
  useEffect(() => {
    if (!timerStartedAt) return
    const updateElapsed = () => {
      setElapsed(getElapsedSeconds(timerStartedAt, pausedElapsedSec, durationSec))
    }
    updateElapsed()
    const id = setInterval(updateElapsed, 1000)
    return () => clearInterval(id)
  }, [durationSec, pausedElapsedSec, timerStartedAt])

  const go = useCallback(
    (delta: number) => {
      setCurrent((prev) => Math.max(0, Math.min(total - 1, prev + delta)))
    },
    [total],
  )

  const toggleTimer = () => {
    if (isCountdownRunning) {
      clearCountdown()
      return
    }
    if (timerStartedAt) {
      setPausedElapsedSec(displayElapsed)
      setTimerStartedAt(null)
      return
    }
    if (pausedElapsedSec > 0) {
      setTimerStartedAt(Date.now() - pausedElapsedSec * 1000)
      return
    }
    startCountdown()
  }

  const resetTimer = () => {
    clearCountdown()
    setTimerStartedAt(null)
    setPausedElapsedSec(0)
    setElapsed(0)
    overdueCueRef.current = -1
  }

  const isPresentationMode = demoMode === null

  const {
    isConnected: isGamepadConnected,
    isActivated: isGamepadActivated,
    pulseHaptic,
  } = useGamepadControls({
    onNext: isPresentationMode ? () => go(1) : undefined,
    onPrev: isPresentationMode ? () => go(-1) : undefined,
    onToggleTimer: isPresentationMode ? toggleTimer : undefined,
    onResetTimer: isPresentationMode ? resetTimer : undefined,
  })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (demoMode) {
        if (e.key === 'Escape') setDemoMode(null)
        return
      }
      if (e.key === 'ArrowRight' || e.key === ' ') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [demoMode, go])

  // Nudge the presenter (haptic pulse) when the elapsed time passes a slide's
  // cue point before the deck has actually reached that slide.
  useEffect(() => {
    if (!cuePointsSec || !timerStartedAt || isCountdownRunning) return

    const overdueCueIndex = cuePointsSec.findLastIndex(
      (cuePointSec, index) => index > 0 && displayElapsed >= cuePointSec && current < index,
    )

    if (overdueCueIndex <= overdueCueRef.current) return

    overdueCueRef.current = overdueCueIndex
    void pulseHaptic(OVERDUE_HAPTIC_INTENSITY, OVERDUE_HAPTIC_DURATION_MS)
  }, [current, cuePointsSec, displayElapsed, isCountdownRunning, pulseHaptic, timerStartedAt])

  // Scale the fixed 900px-wide deck to fill the viewport.
  useEffect(() => {
    const updateZoom = () => {
      const el = presRef.current
      if (!el) return
      el.style.setProperty('zoom', '1')
      const zoomW = Math.min(window.innerWidth, 2000) / 900
      const zoomH = window.innerHeight / (el.offsetHeight || 1)
      el.style.setProperty('zoom', String(Math.min(zoomW, zoomH)))
    }
    updateZoom()
    window.addEventListener('resize', updateZoom)
    return () => window.removeEventListener('resize', updateZoom)
  }, [demoMode])

  if (demoMode && renderDemo) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-[#f2f5fb]">
        {renderDemo(demoMode, () => setDemoMode(null))}
        <button
          onClick={() => setDemoMode(null)}
          className="fixed top-3 right-4 z-50 bg-[#1a3a6b] text-white text-xs px-3 py-1.5 rounded cursor-pointer hover:bg-[#2a5ff5] transition-colors"
        >
          ← slides (Esc)
        </button>
      </div>
    )
  }

  const remaining = Math.max(0, durationSec - displayElapsed)
  const progress = (displayElapsed / durationSec) * 100
  const barColor = remaining > 10 * 60 ? '#4ade80' : remaining > 5 * 60 ? '#fbbf24' : '#f87171'
  const slide = slides[current]
  const slideMarkers = (cuePointsSec ?? []).slice(0, total).map((cuePointSec, index) => ({
    index,
    label: index + 1,
    left: `${(cuePointSec / durationSec) * 100}%`,
    isActive: index === current,
  }))

  return (
    <div className="bg-[#1a1a2e] min-h-screen flex items-start justify-center">
      <div ref={presRef} style={{ width: 900 }}>
        {/* Timer bar */}
        <div className="bg-[#0a0a10] px-3 py-1.5 flex items-center gap-3 border-b border-white/5">
          {isTimerActive ? (
            <>
              <div className="text-[11px] font-mono text-white/80 min-w-[48px]">
                {formatTime(remaining)}
              </div>
              <div className="relative flex-1 h-6">
                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%`, backgroundColor: barColor }}
                  />
                </div>
                {slideMarkers.map((marker) => (
                  <div key={marker.index} className="absolute top-0 bottom-0 pointer-events-none" style={{ left: marker.left }}>
                    <div
                      className={`absolute left-1/2 top-0 -translate-x-1/2 text-[9px] font-mono ${
                        marker.isActive ? 'text-white/90' : 'text-white/35'
                      }`}
                    >
                      {marker.label}
                    </div>
                    <div
                      className={`absolute left-1/2 top-3 h-3 w-px -translate-x-1/2 ${
                        marker.isActive ? 'bg-white/90' : 'bg-white/30'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-white/40">
                {formatTime(displayElapsed)} elapsed {isTimerRunning ? '' : '· paused'}
              </div>
              <button
                onClick={toggleTimer}
                aria-label={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                className="h-7 w-8 leading-[1.1] shrink-0 rounded border border-white/10 bg-white/[0.03] text-[11px] text-white/55 hover:text-white/80 hover:border-white/25 hover:bg-white/[0.06] cursor-pointer transition-colors"
              >
                {isTimerRunning ? '❚❚' : '▶'}
              </button>
              <button
                onClick={resetTimer}
                aria-label="Reset timer"
                title="Reset timer"
                className="h-7 w-8 leading-[1.1] shrink-0 rounded border border-white/10 bg-white/[0.03] text-[11px] text-white/45 hover:text-white/75 hover:border-white/25 hover:bg-white/[0.06] cursor-pointer transition-colors"
              >
                ↺
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleTimer}
                aria-label="Start timer"
                title="Start timer"
                className="h-7 w-7 leading-[1.1] shrink-0 rounded border border-white/10 bg-white/[0.03] text-[11px] text-white/55 hover:text-white/80 hover:border-white/25 hover:bg-white/[0.06] cursor-pointer transition-colors"
              >
                ▶
              </button>
              <div className="relative flex-1 h-6">
                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/5" />
                {slideMarkers.map((marker) => (
                  <div key={marker.index} className="absolute top-0 bottom-0 pointer-events-none" style={{ left: marker.left }}>
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 text-[9px] font-mono text-white/30">
                      {marker.label}
                    </div>
                    <div className="absolute left-1/2 top-3 h-3 w-px -translate-x-1/2 bg-white/20" />
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-white/20">timer not running</div>
            </>
          )}
        </div>

        {/* Slide */}
        <div className="relative overflow-hidden rounded-b-lg" style={{ aspectRatio: '16/9' }}>
          <slide.Component onDemo={setDemoMode} slideNumber={current + 1} total={total} />
          {isCountdownRunning && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-md">
              <div
                key={countdownValue}
                className="animate-[countdown-pop_900ms_ease-out_forwards] text-[220px] leading-none font-black text-white drop-shadow-[0_0_32px_rgba(0,0,0,0.55)] select-none"
              >
                {countdownValue}
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between py-2 gap-2">
          <button
            onClick={() => go(-1)}
            className="bg-[#1a3a6b] text-white border-0 px-4 py-1.5 rounded cursor-pointer text-sm hover:bg-[#2a5ab0] transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sm text-[#aaa]">
            {current + 1} / {total}
          </span>
          <button
            onClick={() => go(1)}
            className="bg-[#1a3a6b] text-white border-0 px-4 py-1.5 rounded cursor-pointer text-sm hover:bg-[#2a5ab0] transition-colors"
          >
            Next →
          </button>
        </div>

        <div className="pb-4 text-[11px] text-center">
          {!isGamepadActivated ? (
            <span className="text-white/35">Press any button on the controller to activate gamepad controls.</span>
          ) : isGamepadConnected ? (
            <span className="text-[#7dd3fc]">
              Gamepad controls active: RB next slide, LB previous slide, A/START start/pause/resume timer, B reset.
            </span>
          ) : (
            <span className="text-white/25">Gamepad disconnected. Keyboard and mouse controls remain available.</span>
          )}
        </div>
      </div>
    </div>
  )
}
