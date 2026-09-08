const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Log environment variables (remove in production)
console.log('Client ID:', process.env.VITE_SPOTIFY_CLIENT_ID ? 'Set' : 'Not set');
console.log('Client Secret:', process.env.VITE_SPOTIFY_CLIENT_SECRET ? 'Set' : 'Not set');
console.log('Redirect URI:', process.env.VITE_SPOTIFY_REDIRECT_URI || 'Not set');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.VITE_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.VITE_SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:5173/callback'
});

// Exchange authorization code for tokens
app.post('/auth/token', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }
  
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    });
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(400).json({ error: 'Failed to get tokens' });
  }
});

// Refresh token endpoint
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  
  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    res.json({
      accessToken: data.body.access_token,
      expiresIn: data.body.expires_in
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(400).json({ error: 'Failed to refresh token' });
  }
});

// Login endpoint
app.get('/auth/login', (req, res) => {
  const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing'
  ];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'state');
  res.json({ url: authorizeURL });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Auth endpoint: http://localhost:${PORT}/auth/login`);
});