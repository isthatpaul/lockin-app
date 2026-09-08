import React from 'react';
import './SpinningRecord.css';

interface SpinningRecordProps {
  albumArt?: string;
  isPlaying: boolean;
}

const SpinningRecord: React.FC<SpinningRecordProps> = ({ albumArt, isPlaying }) => {
  return (
    <div className={`record-container ${isPlaying ? 'spinning' : 'paused'}`}>
      <div className="record-disc">
        <div className="record-center">
          <div className="record-hole"></div>
        </div>
        {albumArt ? (
          <img src={albumArt} alt="Album art" className="record-image" />
        ) : (
          <div className="record-placeholder">🎵</div>
        )}
      </div>
      <div className="record-arm">
        <div className="arm-base"></div>
        <div className="arm-neck"></div>
        <div className="arm-head"></div>
      </div>
    </div>
  );
};

export default SpinningRecord;