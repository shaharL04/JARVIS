import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import qs from 'qs';
import jwt from 'jsonwebtoken';
import { redisClient } from '../../config/redisClient.js';
dotenv.config();
const microsoftAuthRouter = express.Router();
const generateCodeVerifier = () => {
    return crypto.randomBytes(32).toString('base64url');
};
const generateCodeChallenge = (verifier) => {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
};
microsoftAuthRouter.get('/admin-consent', (req, res) => {
    const adminConsentUrl = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0/adminconsent?client_id=${process.env.AZURE_AD_CLIENT_ID}&redirect_uri=${process.env.AZURE_AD_REDIRECT_URI_AFTER_ADMIN_GRANT}&scope=https://graph.microsoft.com/.default`;
    res.redirect(adminConsentUrl);
});
microsoftAuthRouter.get('/login', (req, res) => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    // Store the code verifier in the session
    req.session.codeVerifier = codeVerifier;
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.AZURE_AD_CLIENT_ID}&response_type=code&redirect_uri=${process.env.AZURE_AD_REDIRECT_URI}&response_mode=query&scope=Calendars.Read Calendars.ReadWrite Mail.Read Mail.Send User.Read offline_access&state=12345&code_challenge=${codeChallenge}&code_challenge_method=S256&prompt=consent`;
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
            client_secret: process.env.AZURE_AD_CLIENT_SECRET,
            scope: 'Calendars.Read Calendars.ReadWrite Mail.Read Mail.Send User.Read offline_access',
            code: code,
            redirect_uri: process.env.AZURE_AD_REDIRECT_URI,
            grant_type: 'authorization_code',
            code_verifier: codeVerifier,
        };
        const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log(response.data);
        const refreshToken = response.data.refresh_token;
        const accessToken = response.data.access_token;
        const userInfo = await axios.get(`https://graph.microsoft.com/v1.0/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("userInfo: " + JSON.stringify(userInfo.data.id));
        const userId = userInfo.data.id;
        const expiresIn = 86400;
        await redisClient.setEx(`refreshToken:${userId}`, expiresIn, refreshToken);
        req.session.accessToken = accessToken;
        const jwtToken = jwt.sign({ isAuth: true, account: "outlook", userId: userId }, "secret", { expiresIn: '24h' });
        res.redirect(`http://localhost:3000?token=${jwtToken}`);
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: `Failed to exchange token: ${error.message}` });
    }
});
export default microsoftAuthRouter;
//# sourceMappingURL=microsoftAuthRouter.js.map