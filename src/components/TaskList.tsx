import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Task } from '../App'

interface Props {
  tasks: Task[]
  setTasks: Dispatch<SetStateAction<Task[]>>
  activeTaskId: string | null
  setActiveTaskId: Dispatch<SetStateAction<string | null>>
}

type Filter = 'all' | 'active' | 'done'

export default function TaskList({ tasks, setTasks, activeTaskId, setActiveTaskId }: Props) {
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const addTask = () => {
    const text = input.trim()
    if (!text) return
    setTasks(prev => [...prev, {
      id: crypto.randomUUID(),
      text,
      done: false,
      createdAt: Date.now(),
    }])
    setInput('')
  }

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task
      const nextDone = !task.done
      return {
        ...task,
        done: nextDone,
        completedAt: nextDone ? Date.now() : undefined,
      }
    }))

    if (activeTaskId === id) {
      const toggledTask = tasks.find(task => task.id === id)
      if (toggledTask && !toggledTask.done) {
        setActiveTaskId(null)
      }
    }
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    if (activeTaskId === id) {
      setActiveTaskId(null)
    }
  }

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.done))
    if (activeTaskId && tasks.some(task => task.id === activeTaskId && task.done)) {
      setActiveTaskId(null)
    }
  }

  const pending = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)
  const shown = filter === 'all' ? tasks : filter === 'active' ? pending : done

  return (
    <div className="tasklist">
      <h2 className="card-title">Today's Goals</h2>

      <div className="task-input-row">
        <input
          className="task-input"
          type="text"
          placeholder="add a task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
        />
        <button className="add-btn" onClick={addTask}>+</button>
      </div>

      <div className="task-toolbar">
        {(['all', 'active', 'done'] as Filter[]).map(current => (
          <button
            key={current}
            className={`filter-chip ${filter === current ? 'active' : ''}`}
            onClick={() => setFilter(current)}
          >
            {current}
          </button>
        ))}
        <button className="clear-btn" onClick={clearCompleted} disabled={done.length === 0}>
          clear completed
        </button>
      </div>

      <ul className="task-ul">
        {shown.map(task => (
          <li key={task.id} className={`task-item ${task.done ? 'done' : ''} ${activeTaskId === task.id ? 'active' : ''}`}>
            <button className="task-check" onClick={() => toggleTask(task.id)} aria-label={`Mark ${task.text} done`}>
              <span className={`check-circle ${task.done ? 'filled' : ''}`}>{task.done ? '✓' : ''}</span>
            </button>
            <button
              className={`task-focus ${activeTaskId === task.id ? 'active' : ''}`}
              onClick={() => setActiveTaskId(prev => (prev === task.id ? null : task.id))}
              aria-label={`Pin ${task.text} as current focus`}
            >
              {activeTaskId === task.id ? '●' : '○'}
            </button>
            <span className="task-text">{task.text}</span>
            <button className="task-delete" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.text}`}>×</button>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <p className="task-summary">
          {done.length} / {tasks.length} complete
        </p>
      )}
      {shown.length === 0 && (
        <p className="task-empty">what are you working on today?</p>
      )}
    </div>
  )
}
