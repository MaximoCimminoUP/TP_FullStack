const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/user');

router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Fetch user details using userId extracted from JWT token
        const user = await User.findById(req.userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user details
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;