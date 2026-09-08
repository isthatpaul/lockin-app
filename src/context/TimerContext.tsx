import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimerContextType {
  time: number;
  isRunning: boolean;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  setMode: (mode: 'focus' | 'shortBreak' | 'longBreak') => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  progress: number;
  sessionCount: number;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const MODE_DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [time, setTime] = useState(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [sessionCount, setSessionCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>; // Changed from NodeJS.Timeout
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1);
        setProgress(1 - (time - 1) / MODE_DURATIONS[mode]);
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'focus') {
        setSessionCount(prev => prev + 1);
        if (sessionCount % 4 === 0 && sessionCount > 0) {
          setMode('longBreak');
          setTime(MODE_DURATIONS.longBreak);
        } else {
          setMode('shortBreak');
          setTime(MODE_DURATIONS.shortBreak);
        }
      } else {
        setMode('focus');
        setTime(MODE_DURATIONS.focus);
      }
      setProgress(0);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, time, mode, sessionCount]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTime(MODE_DURATIONS[mode]);
    setProgress(0);
  };
  const skip = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setMode('shortBreak');
      setTime(MODE_DURATIONS.shortBreak);
    } else {
      setMode('focus');
      setTime(MODE_DURATIONS.focus);
    }
    setProgress(0);
  };

  return (
    <TimerContext.Provider value={{
      time,
      isRunning,
      mode,
      setMode,
      start,
      pause,
      reset,
      skip,
      progress,
      sessionCount
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return context;
};