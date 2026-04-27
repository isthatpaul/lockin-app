import { useState, useCallback } from 'react'

export interface Task {
  id: string
  text: string
  done: boolean
  createdAt: number
  completedAt?: number
}

export function useTaskManager(initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const addTask = useCallback((text: string): void => {
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks(prev => [...prev, {
      id: crypto.randomUUID(),
      text: trimmed,
      done: false,
      createdAt: Date.now(),
    }])
  }, [])

  const toggleTask = useCallback((id: string): void => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task
      const nextDone = !task.done
      return {
        ...task,
        done: nextDone,
        completedAt: nextDone ? Date.now() : undefined,
      }
    }))
  }, [])

  const deleteTask = useCallback((id: string): void => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearCompleted = useCallback((): void => {
    setTasks(prev => prev.filter(task => !task.done))
  }, [])

  return {
    tasks,
    setTasks,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  }
}