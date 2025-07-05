const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { generateToken } = require('../config/passport');
router.post('/register', async (req, res) => {
    try {
        console.log('Registration attempt:', req.body);
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
        console.log('User created:', user);

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


// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', { session: false }, (err, user, info) => {
//         if (err) return next(err);
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: info.message
//             });
//         }

//         // Generate token (MUST ADD THIS)
//         const token = generateToken(user);

//         return res.json({
//             success: true,
//             token: token,  // Include token in response
//             user: {
//                 id: user._id,
//                 firstName: user.firstName,  // Add firstName
//                 email: user.email,
//                 role: user.role
//             }
//         });
//     })(req, res, next);
// });

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

// Protected route example
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        message: 'This is a protected route',
        user: req.user
    });
});

module.exports = router;