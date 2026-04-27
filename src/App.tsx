import { useEffect, useState } from 'react'
import Timer from './components/Timer'
import TaskList from './components/TaskList'
import AmbientPlayer from './components/AmbientPlayer'
import StreakTracker from './components/StreakTracker'

export type TimerMode = 'focus' | 'short' | 'long'

export interface Task {
  id: string
  text: string
  done: boolean
  createdAt: number
  completedAt?: number
}

interface StoredState {
  tasks: Task[]
  sessionCount: number
  currentMode: TimerMode
  activeTaskId: string | null
  focusMinutesToday: number
  lastActiveDate: string
}

const STORAGE_KEY = 'lockin.app.state.v1'
const DAILY_FOCUS_TARGET = 120

function getTodayStamp() {
  return new Date().toISOString().slice(0, 10)
}

function readInitialState(): StoredState {
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
        parsed.currentMode === 'focus' || parsed.currentMode === 'short' || parsed.currentMode === 'long' ? parsed.currentMode : 'focus',
      activeTaskId: typeof parsed.activeTaskId === 'string' ? parsed.activeTaskId : null,
      focusMinutesToday: typeof parsed.focusMinutesToday === 'number' ? parsed.focusMinutesToday : 0,
      lastActiveDate: typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : getTodayStamp(),
    }
  } catch {
    return fallback
  }
}

function App() {
  const [initial] = useState<StoredState>(() => readInitialState())
  const today = getTodayStamp()
  const isNewDay = initial.lastActiveDate !== today

  const [tasks, setTasks] = useState<Task[]>(initial.tasks)
  const [sessionCount, setSessionCount] = useState(isNewDay ? 0 : initial.sessionCount)
  const [currentMode, setCurrentMode] = useState<TimerMode>(initial.currentMode)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(initial.activeTaskId)
  const [focusMinutesToday, setFocusMinutesToday] = useState(isNewDay ? 0 : initial.focusMinutesToday)

  const onSessionComplete = (mode: TimerMode, completedSeconds: number) => {
    if (mode === 'focus') {
      setSessionCount(prev => {
        const nextCount = prev + 1
        setCurrentMode(nextCount % 4 === 0 ? 'long' : 'short')
        return nextCount
      })

      setFocusMinutesToday(prev => prev + Math.round(completedSeconds / 60))
      return
    }

    setCurrentMode('focus')
  }

  const activeTask = tasks.find(task => task.id === activeTaskId) ?? null
  const dayStart = new Date()
  dayStart.setHours(0, 0, 0, 0)
  const completedToday = tasks.filter(task => task.done && task.completedAt && task.completedAt >= dayStart.getTime()).length
  const focusPercent = Math.min(100, Math.round((focusMinutesToday / DAILY_FOCUS_TARGET) * 100))

  useEffect(() => {
    if (activeTaskId && !tasks.some(task => task.id === activeTaskId)) {
      setActiveTaskId(null)
    }
  }, [activeTaskId, tasks])

  useEffect(() => {
    const stateToStore: StoredState = {
      tasks,
      sessionCount,
      currentMode,
      activeTaskId,
      focusMinutesToday,
      lastActiveDate: today,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore))
  }, [tasks, sessionCount, currentMode, activeTaskId, focusMinutesToday, today])

  return (
    <div className="app">
      <div className="grain" />
      <header className="header">
        <div className="header-inner">
          <div>
            <div className="logo">
              <span className="logo-icon">●</span>
              <span className="logo-text">lockin</span>
            </div>
            <p className="subhead">A focus cockpit for deep work sessions.</p>
          </div>
          <StreakTracker sessionCount={sessionCount} focusMinutesToday={focusMinutesToday} />
        </div>
      </header>

      <main className="main">
        <section className="overview">
          <article className="metric-card">
            <p className="metric-label">Today</p>
            <p className="metric-value">{focusMinutesToday} min</p>
            <div className="metric-bar" aria-hidden="true">
              <span style={{ width: `${focusPercent}%` }} />
            </div>
            <p className="metric-meta">{focusPercent}% of 2-hour target</p>
          </article>
          <article className="metric-card">
            <p className="metric-label">Completed tasks</p>
            <p className="metric-value">{completedToday}</p>
            <p className="metric-meta">Done in the last 24 hours</p>
          </article>
          <article className="metric-card active-task-card">
            <p className="metric-label">Current focus</p>
            <p className="metric-value small">{activeTask ? activeTask.text : 'Pick a task to anchor this session'}</p>
            <p className="metric-meta">Task pin helps keep context stable</p>
          </article>
        </section>

        <div className="grid">
          <section className="card timer-card">
            <Timer
              mode={currentMode}
              setMode={setCurrentMode}
              onComplete={onSessionComplete}
              activeTaskLabel={activeTask?.text ?? null}
            />
          </section>

          <section className="card task-card">
            <TaskList
              tasks={tasks}
              setTasks={setTasks}
              activeTaskId={activeTaskId}
              setActiveTaskId={setActiveTaskId}
            />
          </section>

          <section className="card ambient-card">
            <AmbientPlayer />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App