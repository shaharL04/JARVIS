import jwt from 'jsonwebtoken';
const jwtSecret = "secret";
const verifyJwtMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Authorization header is missing' });
        return;
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        console.log("this is decoded: " + JSON.stringify(decoded));
        req.user = decoded;
        next();
    });
};
export default verifyJwtMiddleware;
//# sourceMappingURL=jwtMiddleware.js.map