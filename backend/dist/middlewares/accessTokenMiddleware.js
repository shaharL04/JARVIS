import axios from 'axios';
const verifyToken = async (req, res, next) => {
    const token = req.session.accessToken;
    if (!token) {
        res.status(400).json({ error: 'Token is required' });
        return;
    }
    try {
        // Validate the token by making a request to Microsoft Graph API
        const response = await axios.get(`https://graph.microsoft.com/v1.0/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        req.user = response.data;
        console.log("response data: " + JSON.stringify(response.data));
        next();
    }
    catch (error) {
        res.status(401).send('Invalid access token');
        return;
    }
};
export default verifyToken;
//# sourceMappingURL=accessTokenMiddleware.js.map