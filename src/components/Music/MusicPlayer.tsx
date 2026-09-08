import React from 'react';
import { useSpotify } from '../../context/SpotifyContext';
import SpinningRecord from './SpinningRecord';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import './MusicPlayer.css';

const MusicPlayer: React.FC = () => {
  const { currentTrack, isPlaying, play, pause, next, previous, isAuthenticated, isLoading } = useSpotify();

  if (isLoading) {
    return (
      <div className="music-player-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">⏳</div>
          <h3>Loading...</h3>
          <p>Connecting to Spotify</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="music-player-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">🎵</div>
          <h3>Connect Spotify</h3>
          <p>Link your Spotify account to see what's playing</p>
        </div>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="music-player-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">⏸️</div>
          <h3>Nothing Playing</h3>
          <p>Play something on Spotify to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="music-player">
      <div className="music-header">
        <h3 className="music-title">Now Playing</h3>
      </div>

      <div className="music-content">
        <div className="music-album">
          <SpinningRecord 
            albumArt={currentTrack.album.images[0]?.url}
            isPlaying={isPlaying}
          />
        </div>

        <div className="music-info">
          <h4 className="track-name">{currentTrack.name}</h4>
          <p className="track-artist">
            {currentTrack.artists.map(a => a.name).join(', ')}
          </p>
          <p className="track-album">{currentTrack.album.name}</p>

          <div className="music-controls">
            <button onClick={previous} className="btn-music">
              <FaStepBackward />
            </button>
            <button onClick={isPlaying ? pause : play} className="btn-music primary">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={next} className="btn-music">
              <FaStepForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;