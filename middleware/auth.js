const jwt = require('jsonwebtoken');
const User = require("../models/userModel");


// check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json([{ message: 'No token, authorization denied', type: 'error' }]);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json([{ message: 'No token, authorization denied', type: 'error' }]);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
        if (req.user.role !== "admin") {
            return res.status(401).json([{ message: 'Not admin', type: 'error' }]);
        }
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

