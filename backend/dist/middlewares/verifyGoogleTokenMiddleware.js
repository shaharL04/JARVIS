import axios from 'axios';
import { redisClient } from '../config/redisClient.js';
const verifyGoogleTokenMiddleware = async (req, res, next) => {
    const userId = req.user.userId;
    const cacheKey = `refreshToken:${userId}`;
    const cachedRefreshToken = await redisClient.get(cacheKey);
    const refreshToken = cachedRefreshToken;
    let token;
    if (!refreshToken) {
        res.status(400).json({ error: 'Token is required' });
        return;
    }
    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        token = response.data.access_token;
    }
    catch (error) {
        console.error("Error refreshing access token:", error.response?.data || error.message);
    }
    try {
        console.log("TOKENN" + token);
        // Validate the token by making a request to Google People API
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        req.user = token;
        console.log("response data: " + JSON.stringify(response.data));
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).send('Invalid access token');
        return;
    }
};
export default verifyGoogleTokenMiddleware;
//# sourceMappingURL=verifyGoogleTokenMiddleware.js.map