// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log("TOKENNN"+ token)
    // Check if the token is provided
    if (!token) {
        res.status(400).json({ error: 'Token is required' });
        return;
    }

    try {
        // Validate the token by making a request to Microsoft Graph API
        const response = await axios.get(`https://graph.microsoft.com/v1.0/me`, {
            headers: {
                Authorization: `Bearer ${token}`, // Use the provided token for validation
            },
        });

        // Attach user info to the request object if needed
        req.user = response.data; // Attach user information to the request
        console.log("response data: "+ JSON.stringify(response.data))
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).send('Invalid access token');
        return;
    }
};

export default verifyToken;
