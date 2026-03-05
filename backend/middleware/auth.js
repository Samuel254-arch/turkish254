// auth.js - Simple admin authentication
const requireAdmin = (req, res, next) => {
    // Check if user is logged in (session based)
    if (req.session && req.session.isAdmin) {
        next(); // User is authenticated, continue
    } else {
        res.status(401).json({ 
            error: 'Unauthorized. Please login as admin.' 
        });
    }
};

module.exports = { requireAdmin };