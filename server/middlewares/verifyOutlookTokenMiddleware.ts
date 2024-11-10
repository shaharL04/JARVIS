// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { redisClient } from '../config/redisClient.js';
import qs from 'qs'

const verifyOutlookTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const userId = req.user.userId

    const cacheKey = `refreshToken:${userId}`;
    const cachedRefreshToken = await redisClient.get(cacheKey);
    const refreshToken = cachedRefreshToken
    let token;

    if (!refreshToken) {
        res.status(400).json({ error: 'Token is required' });
        return;
    }
    

    try {
        console.log("refreshTokn: "+refreshToken)
        const data = {
            client_id: process.env.AZURE_AD_CLIENT_ID,
            client_secret: process.env.AZURE_AD_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            scope: 'Calendars.Read Calendars.ReadWrite Mail.Read Mail.Send User.Read offline_access',
          };
      
          const response = await axios.post(
            `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`,
            qs.stringify(data),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );

          
    
        console.log("New access token:", response.data.access_token);
        token = response.data.access_token;
    } catch (error:any) {
        console.error("Error refreshing Microsoft access token:", error.response?.data || error.message);
    }


    try {
        // Validate the token by making a request to Microsoft Graph API
        const response = await axios.get(`https://graph.microsoft.com/v1.0/me`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });

        req.user = token;

        next(); 
    } catch (error) {
        res.status(401).send('Invalid access token');
        return;
    }
};

export default verifyOutlookTokenMiddleware;
