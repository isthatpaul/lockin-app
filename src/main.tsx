import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SpotifyProvider } from './context/SpotifyContext';
import { TimerProvider } from './context/TimerContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SpotifyProvider>
      <TimerProvider>
        <App />
      </TimerProvider>
    </SpotifyProvider>
  </React.StrictMode>
);