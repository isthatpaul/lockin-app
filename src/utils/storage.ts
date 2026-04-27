import type { Task } from '../hooks/useTaskManager'
import type { TimerMode } from '../hooks/useTimer'

export interface StoredState {
  tasks: Task[]
  sessionCount: number
  currentMode: TimerMode
  activeTaskId: string | null
  focusMinutesToday: number
  lastActiveDate: string
}

const STORAGE_KEY = 'lockin.app.state.v1'

export function getTodayStamp(): string {
  return new Date().toISOString().slice(0, 10)
}

export function readInitialState(): StoredState {
  const fallback: StoredState = {
    tasks: [],
    sessionCount: 0,
    currentMode: 'focus',
    activeTaskId: null,
    focusMinutesToday: 0,
    lastActiveDate: getTodayStamp(),
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<StoredState>

    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      sessionCount: typeof parsed.sessionCount === 'number' ? parsed.sessionCount : 0,
      currentMode:
        parsed.currentMode === 'focus' || parsed.currentMode === 'short' || parsed.currentMode === 'long'
          ? parsed.currentMode
          : 'focus',
      activeTaskId: typeof parsed.activeTaskId === 'string' ? parsed.activeTaskId : null,
      focusMinutesToday: typeof parsed.focusMinutesToday === 'number' ? parsed.focusMinutesToday : 0,
      lastActiveDate: typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : getTodayStamp(),
    }
  } catch {
    return fallback
  }
}

export function saveState(state: StoredState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    console.error('Failed to save state to localStorage')
  }
}