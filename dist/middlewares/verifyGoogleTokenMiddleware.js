import axios from 'axios';
const verifyGoogleTokenMiddleware = async (req, res, next) => {
    const token = req.session.accessToken;
    if (!token) {
        res.status(400).json({ error: 'Token is required' });
        return;
    }
    try {
        console.log("TOKENN" + token);
        // Validate the token by making a request to Google People API
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
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
export default verifyGoogleTokenMiddleware;
//# sourceMappingURL=verifyGoogleTokenMiddleware.js.map