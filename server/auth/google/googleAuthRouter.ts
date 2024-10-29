import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import qs from 'qs';
import jwt from 'jsonwebtoken';

dotenv.config();
const googleAuthRouter = express.Router();
const generateCodeVerifier = () => {
    return crypto.randomBytes(32).toString('base64url'); 
  };
  
  const generateCodeChallenge = (verifier: string) => {
    const hash = crypto.createHash('sha256').update(verifier).digest(); 
    return Buffer.from(hash).toString('base64url'); 
  };

googleAuthRouter.get('/login', (req, res) => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  req.session.codeVerifier = codeVerifier;
  const state = crypto.randomBytes(16).toString('hex'); 

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=${encodeURIComponent('openid profile email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.compose')}&state=secureRandomState&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  res.redirect(authUrl);
});

googleAuthRouter.get('/callback', async (req, res) => {
  const code = req.query.code as string;
  const codeVerifier = req.session.codeVerifier;

  if (!code) {
    res.status(400).json({ error: 'Authorization code missing in callback' });
    return;
  }
  if (!codeVerifier) {
    res.status(400).json({ error: 'Code verifier missing from session' });
    return;
  }

  try {
    const data = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    };

    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      qs.stringify(data),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    req.session.accessToken = response.data.access_token;
    // After successful token exchange
    const jwtToken = jwt.sign({ isAuth: true, account: "google" }, "secret", { expiresIn: '24h' });

    res.redirect(`http://localhost:3000?token=${jwtToken}`); // Redirect after successful login
  } catch (error: any) {
    console.error('Error during token exchange:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to exchange token.' });
  }
});

export default googleAuthRouter;
