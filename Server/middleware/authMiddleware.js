const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify Token
const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// Role-Based Authorization
const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

module.exports = { verifyToken, authorizeRole };
