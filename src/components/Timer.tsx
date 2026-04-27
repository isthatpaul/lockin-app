import { useState, useEffect, useRef, useCallback } from 'react'
import type { TimerMode } from '../App'

interface Props {
  mode: TimerMode
  setMode: (mode: TimerMode) => void
  onComplete: (mode: TimerMode, completedSeconds: number) => void
  activeTaskLabel: string | null
}

const DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
}

const MODE_LABELS: Record<TimerMode, string> = {
  focus: 'Focus',
  short: 'Short Break',
  long: 'Long Break',
}

export default function Timer({ mode, setMode, onComplete, activeTaskLabel }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS[mode])
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const reset = useCallback((m: TimerMode) => {
    setRunning(false)
    setCompleted(false)
    setSecondsLeft(DURATIONS[m])
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    reset(mode)
  }, [mode, reset])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            setCompleted(true)
            onComplete(mode, DURATIONS[mode])

            const modeLabel = MODE_LABELS[mode]
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`${modeLabel} complete`, {
                body: mode === 'focus' ? 'Break is ready.' : 'Focus mode is ready.',
              })
            }

            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, onComplete, mode])

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'default') {
      return
    }

    const onFirstInteraction = () => {
      Notification.requestPermission().catch(() => {
        // Permission prompts can fail in some browser contexts.
      })
      window.removeEventListener('pointerdown', onFirstInteraction)
    }

    window.addEventListener('pointerdown', onFirstInteraction)
    return () => window.removeEventListener('pointerdown', onFirstInteraction)
  }, [])

  useEffect(() => {
    const nextLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`
    document.title = running ? `${nextLabel} - ${MODE_LABELS[mode]} | lockin` : `lockin`
    return () => {
      document.title = 'lockin'
    }
  }, [mode, running, secondsLeft])

  useEffect(() => {
    const onSpaceToggle = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return
      if (event.target instanceof HTMLElement && /input|textarea|button|select/i.test(event.target.tagName)) {
        return
      }

      event.preventDefault()
      setCompleted(false)
      setRunning(prev => !prev)
    }

    window.addEventListener('keydown', onSpaceToggle)
    return () => window.removeEventListener('keydown', onSpaceToggle)
  }, [])

  const total = DURATIONS[mode]
  const progress = ((total - secondsLeft) / total) * 100
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')
  const endsAt = new Date(Date.now() + secondsLeft * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  const circumference = 2 * Math.PI * 88
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <div className="timer">
      <h2 className="card-title">Timer</h2>
      <div className="mode-tabs">
        {(['focus', 'short', 'long'] as TimerMode[]).map(m => (
          <button
            key={m}
            className={`mode-tab ${mode === m ? 'active' : ''}`}
            onClick={() => setMode(m)}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <p className="timer-hint" aria-live="polite">
        {activeTaskLabel ? `Anchored to: ${activeTaskLabel}` : 'Pick a task to stay anchored.'}
      </p>

      <div className="timer-ring-wrap">
        <svg className="timer-ring" viewBox="0 0 200 200" width="200" height="200">
          <circle
            cx="100" cy="100" r="88"
            fill="none"
            stroke="var(--ring-bg)"
            strokeWidth="6"
          />
          <circle
            cx="100" cy="100" r="88"
            fill="none"
            stroke="var(--ring-fill)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="timer-display">
          <span className="timer-digits">{mins}:{secs}</span>
          <span className="timer-label">{completed ? '✓ done!' : MODE_LABELS[mode]}</span>
          <span className="timer-sub">Ends at {endsAt}</span>
        </div>
      </div>

      <div className="timer-controls">
        <button className="ctrl-btn secondary" onClick={() => reset(mode)}>reset</button>
        <button
          className="ctrl-btn secondary"
          onClick={() => {
            setSecondsLeft(0)
            setRunning(false)
            setCompleted(true)
            onComplete(mode, DURATIONS[mode])
          }}
        >
          skip
        </button>
        <button
          className={`ctrl-btn primary ${running ? 'pause' : 'play'}`}
          onClick={() => { setCompleted(false); setRunning(r => !r) }}
        >
          {running ? 'pause' : completed ? 'restart' : 'start'}
        </button>
      </div>

      <p className="timer-help">press space to start/pause</p>
    </div>
  )
}
