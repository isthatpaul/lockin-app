import React, { useState } from 'react';
import { FaVolumeUp, FaVolumeMute, FaStop } from 'react-icons/fa';
import './AmbienceControls.css';

const AmbienceControls: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const sounds = [
    { id: 'rain', icon: '🌧️', label: 'Rain' },
    { id: 'fireplace', icon: '🔥', label: 'Fireplace' },
    { id: 'forest', icon: '🌲', label: 'Forest' },
  ];

  const toggleSound = (id: string) => {
    if (activeSound === id) {
      setActiveSound(null);
    } else {
      setActiveSound(id);
    }
  };

  return (
    <div className="ambience-controls">
      <div className="ambience-header">
        <h3 className="ambience-title">Ambience</h3>
        <div className="ambience-controls-actions">
          <button 
            className="btn-ambience mute"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <button 
            className="btn-ambience stop"
            onClick={() => setActiveSound(null)}
          >
            <FaStop />
          </button>
        </div>
      </div>

      <div className="sound-grid">
        {sounds.map(sound => (
          <button
            key={sound.id}
            className={`sound-btn ${activeSound === sound.id ? 'active' : ''}`}
            onClick={() => toggleSound(sound.id)}
          >
            <span className="sound-icon">{sound.icon}</span>
            <span className="sound-label">{sound.label}</span>
            {activeSound === sound.id && (
              <span className="sound-indicator"></span>
            )}
          </button>
        ))}
      </div>

      {activeSound && (
        <div className="sound-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '65%' }}></div>
          </div>
          <span className="progress-label">Playing {activeSound}</span>
        </div>
      )}

      <div className="ambience-footer">
        <span className="silence-mode">🔇 Silence mode</span>
        <button className="btn-stop-audio">stop audio</button>
      </div>
    </div>
  );
};

export default AmbienceControls;