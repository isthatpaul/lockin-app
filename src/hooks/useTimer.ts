import { useState, useEffect, useRef, useCallback } from 'react'

export type TimerMode = 'focus' | 'short' | 'long'

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

interface UseTimerProps {
  mode: TimerMode
  onComplete: (mode: TimerMode, completedSeconds: number) => void
}

export function useTimer({ mode, onComplete }: UseTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS[mode])
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const reset = useCallback((m: TimerMode): void => {
    setRunning(false)
    setCompleted(false)
    setSecondsLeft(DURATIONS[m])
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    reset(mode)
  }, [mode, reset])

  // Timer countdown
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
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, onComplete, mode])

  // Request notification permission on first interaction
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'default') {
      return
    }

    const onFirstInteraction = (): void => {
      Notification.requestPermission().catch(() => {
        // Permission prompts can fail in some browser contexts.
      })
      window.removeEventListener('pointerdown', onFirstInteraction)
    }

    window.addEventListener('pointerdown', onFirstInteraction)
    return () => window.removeEventListener('pointerdown', onFirstInteraction)
  }, [])

  // Update document title
  useEffect(() => {
    const nextLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`
    document.title = running ? `${nextLabel} - ${MODE_LABELS[mode]} | lockin` : 'lockin'
    return () => {
      document.title = 'lockin'
    }
  }, [mode, running, secondsLeft])

  // Keyboard shortcut (space)
  useEffect(() => {
    const onSpaceToggle = (event: KeyboardEvent): void => {
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

  const toggle = useCallback((): void => {
    setCompleted(false)
    setRunning(r => !r)
  }, [])

  const skip = useCallback((): void => {
    setSecondsLeft(0)
    setRunning(false)
    setCompleted(true)
    onComplete(mode, DURATIONS[mode])
  }, [mode, onComplete])

  return {
    secondsLeft,
    totalSeconds: DURATIONS[mode],
    running,
    completed,
    MODE_LABELS,
    DURATIONS,
    reset,
    toggle,
    skip,
  }
}