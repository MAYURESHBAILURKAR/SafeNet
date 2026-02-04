// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddlewareFunc = (req, res, next) => {
    // 1. Get Token from Header
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied: No Token Provided');

    try {
        // 2. Verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secretKey123');

        // 3. Add User ID to the Request (so the next function can use it)
        req.user = verified;
        next(); // Continue to the next step
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};


module.exports = authMiddlewareFunc