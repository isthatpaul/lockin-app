import React, { createContext, useContext, useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

interface SpotifyContextType {
  spotify: SpotifyWebApi.SpotifyWebApiJs | null;
  currentTrack: SpotifyApi.TrackObjectFull | null;
  isPlaying: boolean;
  login: () => void;
  logout: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

// Get the API URL based on environment
const getApiUrl = () => {
  // For production, use the deployed URL
  if (import.meta.env.PROD) {
    // Replace with your actual Vercel URL after deployment
    return 'https://your-app-name.vercel.app';
  }
  // For development, use localhost
  return 'http://localhost:3001';
};

const API_URL = getApiUrl();

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spotify, setSpotify] = useState<SpotifyWebApi.SpotifyWebApiJs | null>(null);
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.TrackObjectFull | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for code in URL (authorization code flow)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Exchange code for token
      exchangeCodeForToken(code);
    } else {
      // Check for existing token
      const token = localStorage.getItem('spotifyToken');
      if (token) {
        const s = new SpotifyWebApi();
        s.setAccessToken(token);
        setSpotify(s);
        setIsAuthenticated(true);
        fetchCurrentTrack(s);
      }
      setIsLoading(false);
    }
  }, []);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const data = await response.json();
      
      if (data.accessToken) {
        localStorage.setItem('spotifyToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('spotifyRefreshToken', data.refreshToken);
        }
        
        const s = new SpotifyWebApi();
        s.setAccessToken(data.accessToken);
        setSpotify(s);
        setIsAuthenticated(true);
        fetchCurrentTrack(s);
        
        // Remove code from URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentTrack = async (s: SpotifyWebApi.SpotifyWebApiJs) => {
    try {
      const data = await s.getMyCurrentPlaybackState();
      if (data && data.item) {
        setCurrentTrack(data.item as SpotifyApi.TrackObjectFull);
        setIsPlaying(data.is_playing);
      }
    } catch (error) {
      console.error('Error fetching track:', error);
    }
  };

  const login = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing';
    
    // Use authorization code flow
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  const logout = () => {
    localStorage.removeItem('spotifyToken');
    localStorage.removeItem('spotifyRefreshToken');
    setSpotify(null);
    setIsAuthenticated(false);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const play = async () => {
    if (spotify) {
      try {
        await spotify.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing:', error);
      }
    }
  };

  const pause = async () => {
    if (spotify) {
      try {
        await spotify.pause();
        setIsPlaying(false);
      } catch (error) {
        console.error('Error pausing:', error);
      }
    }
  };

  const next = async () => {
    if (spotify) {
      try {
        await spotify.skipToNext();
        setTimeout(() => fetchCurrentTrack(spotify), 500);
      } catch (error) {
        console.error('Error skipping:', error);
      }
    }
  };

  const previous = async () => {
    if (spotify) {
      try {
        await spotify.skipToPrevious();
        setTimeout(() => fetchCurrentTrack(spotify), 500);
      } catch (error) {
        console.error('Error skipping:', error);
      }
    }
  };

  return (
    <SpotifyContext.Provider value={{
      spotify,
      currentTrack,
      isPlaying,
      login,
      logout,
      play,
      pause,
      next,
      previous,
      isAuthenticated,
      isLoading
    }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within SpotifyProvider');
  }
  return context;
};