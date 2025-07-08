const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { generateToken } = require('../config/passport');
router.post('/register', async (req, res) => {
    try {
        ('Registration attempt:', req.body);
        const { firstName, lastName, email, password } = req.body;

        // Validate input
        if (!firstName || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = new User({ firstName, lastName, email, password });
        await user.save();
        ('User created:', user);

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('REGISTRATION ERROR:', err);
        res.status(500).json({
            message: 'Error creating user',
            error: err.message,
            stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: info.message
            });
        }

        // Generate token
        const token = generateToken(user);

        // Determine redirect path based on role
        const redirectPath = (user.role === 'admin')
            ? '/dashboard'
            : '/';

        return res.json({
            success: true,
            token: token, // Make sure token is included
            redirect: redirectPath,
            user: {
                id: user._id,
                firstName: user.firstName, // Add firstName
                email: user.email,
                role: user.role
            }
        });
    })(req, res, next);
});

// Add this route in your authRoutes.js
router.get('/validate-token',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        // If we get here, the token is valid
        res.json({
            user: {
                id: req.user._id,
                firstName: req.user.firstName,
                email: req.user.email,
                role: req.user.role
            }
        });
    }
);

// authRoutes.js
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Return minimal user data without sensitive information
        res.json({
            user: {
                id: req.user._id,
                firstName: req.user.firstName,
                email: req.user.email,
                role: req.user.role // singular role
            }
        });
    } catch (err) {
        console.error('Protected route error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;