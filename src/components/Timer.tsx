import { useTimer, type TimerMode } from '../hooks/useTimer'

interface Props {
  mode: TimerMode
  setMode: (mode: TimerMode) => void
  onComplete: (mode: TimerMode, completedSeconds: number) => void
  activeTaskLabel: string | null
}

export default function Timer({ mode, setMode, onComplete, activeTaskLabel }: Props) {
  // ✅ Remove DURATIONS from here - it's not used
  const { secondsLeft, totalSeconds, running, completed, MODE_LABELS, reset, toggle, skip } = useTimer({
    mode,
    onComplete,
  })

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100
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
          <circle cx="100" cy="100" r="88" fill="none" stroke="var(--ring-bg)" strokeWidth="6" />
          <circle
            cx="100"
            cy="100"
            r="88"
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
        <button className="ctrl-btn secondary" onClick={skip}>skip</button>
        <button className={`ctrl-btn primary ${running ? 'pause' : 'play'}`} onClick={toggle}>
          {running ? 'pause' : completed ? 'restart' : 'start'}
        </button>
      </div>

      <p className="timer-help">press space to start/pause</p>
    </div>
  )
}