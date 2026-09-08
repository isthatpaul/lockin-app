import React from 'react';
import { useTimer } from '../../context/TimerContext';
import { useSpotify } from '../../context/SpotifyContext';
import { FaPlay, FaPause, FaRedo, FaForward } from 'react-icons/fa';
import './TimerDisplay.css';

const TimerDisplay: React.FC = () => {
  const { time, isRunning, mode, start, pause, reset, skip, progress } = useTimer();
  const { currentTrack } = useSpotify();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getModeColor = () => {
    switch(mode) {
      case 'focus': return 'var(--primary)';
      case 'shortBreak': return 'var(--accent)';
      case 'longBreak': return 'var(--secondary)';
      default: return 'var(--primary)';
    }
  };

  const albumArt = currentTrack?.album?.images[0]?.url;

  return (
    <div className="timer-display" style={{ 
      backgroundImage: albumArt ? `url(${albumArt})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="timer-overlay">
        <div className="timer-header">
          <span className="timer-mode" style={{ color: getModeColor() }}>
            {mode === 'focus' ? '🎯 FOCUS' : mode === 'shortBreak' ? '☕ BREAK' : '🌙 LONG BREAK'}
          </span>
          <span className="timer-end">Ends at 11:53 PM</span>
        </div>

        <div className="timer-circle">
          <svg className="timer-svg" viewBox="0 0 120 120">
            <circle
              className="timer-bg"
              cx="60"
              cy="60"
              r="54"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              className="timer-progress"
              cx="60"
              cy="60"
              r="54"
              stroke={getModeColor()}
              strokeWidth="8"
              fill="none"
              strokeDasharray="339.292"
              strokeDashoffset={339.292 * (1 - progress)}
              strokeLinecap="round"
            />
          </svg>
          <div className="timer-time">{formatTime(time)}</div>
        </div>

        <div className="timer-controls">
          <button onClick={reset} className="btn-control">
            <FaRedo />
          </button>
          <button onClick={isRunning ? pause : start} className="btn-control primary">
            {isRunning ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={skip} className="btn-control">
            <FaForward />
          </button>
        </div>

        <div className="timer-hint">
          <span>press space to start/pause</span>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;