const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect Middleware
 * Ensures the route is only accessible to authenticated users with a valid JWT.
 */
const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the header string
            token = req.headers.authorization.split(' ')[1];
            
            // Verify the token cryptographically
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach the user document to the request object (excluding password)
            req.user = await User.findById(decoded.id).select('-password');
            
            next(); // Move to the next middleware or controller
        } catch (error) {
            console.error("Token verification failed:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

/**
 * Admin Middleware
 * Ensures the route is only accessible to users with the 'admin' role.
 * MUST be placed after the 'protect' middleware in the route definition.
 */
const admin = (req, res, next) => {
    // Check if user exists on the request object and has the correct role
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed
    } else {
        res.status(403).json({ message: 'Not authorized as an administrator' });
    }
};

module.exports = { protect, admin };