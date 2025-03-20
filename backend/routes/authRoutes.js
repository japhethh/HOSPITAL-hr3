const express = require('express');
const User = require('../models/UserData');
const { register, login, logout } = require('../controllers/authController');
const jwt = require('jsonwebtoken')
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout); 

// Verify Token Middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Protected Route
router.get('/protected', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;