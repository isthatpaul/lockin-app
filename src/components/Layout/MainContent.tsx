import React from 'react';
import TimerDisplay from '../Timer/TimerDisplay';
import MusicPlayer from '../Music/MusicPlayer';
import AmbienceControls from '../Ambience/AmbienceControls';
import './MainContent.css';

const MainContent: React.FC = () => {
  return (
    <main className="main-content">
      <div className="content-grid">
        <div className="timer-section">
          <TimerDisplay />
        </div>
        <div className="music-section">
          <MusicPlayer />
        </div>
        <div className="ambience-section">
          <AmbienceControls />
        </div>
      </div>
    </main>
  );
};

export default MainContent;