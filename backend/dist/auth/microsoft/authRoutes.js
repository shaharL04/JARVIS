import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import qs from 'qs';
dotenv.config();
const microsoftAuthRouter = express.Router();
const generateCodeVerifier = () => {
    return crypto.randomBytes(32).toString('base64url');
};
const generateCodeChallenge = (verifier) => {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
};
microsoftAuthRouter.get('/login', (req, res) => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    // Store the code verifier in the session
    req.session.codeVerifier = codeVerifier;
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.AZURE_AD_CLIENT_ID}&response_type=code&redirect_uri=${process.env.AZURE_AD_REDIRECT_URI}&response_mode=query&scope=https://graph.microsoft.com/.default&state=12345&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    res.redirect(authUrl);
});
microsoftAuthRouter.get('/callback', async (req, res) => {
    const code = req.query.code;
    const codeVerifier = req.session.codeVerifier;
    // Ensure that we have the necessary parameters
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
            client_id: process.env.AZURE_AD_CLIENT_ID,
            scope: 'https://graph.microsoft.com/.default',
            code: code,
            redirect_uri: process.env.AZURE_AD_REDIRECT_URI,
            grant_type: 'authorization_code',
            code_verifier: codeVerifier,
        };
        const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'http://localhost:3000',
            },
        });
        console.log('Token exchange response:', response.data);
        req.session.accessToken = response.data.access_token; // Store the access token in the session
        res.redirect('http://localhost:3000'); // The session is now ready to be used
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: `Failed to exchange token: ${error.message}` });
    }
});
export default microsoftAuthRouter;
//# sourceMappingURL=authRoutes.js.map