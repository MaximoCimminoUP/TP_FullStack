const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth-Middleware');
const User = require('../models/user');
const StuffedAnimal = require('../models/stuffedAnimal');
const Order = require('../models/order');

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




router.post('/customize-plushie', verifyToken, async (req, res) => {
    try {
        const { userId, type, colors, accessories } = req.body;

        // create new custom plush
        const newPlushie = new StuffedAnimal({
            userId,
            type,
            colors,
            accessories,
            stock: 1 // it assumes that once created, you will order 1. So it creates a single stock item for i.
        });

        const savedPlushie = await newPlushie.save();

        res.status(200).json({ message: 'Plushie customized successfully', plushie: savedPlushie });
    } catch (error) {
        console.error('Error customizing plushie:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/plushie-ranking', async (req, res) => {
    try {
        // Add orders to count the number of orders for each plushie type
        const plushieOrders = await Order.aggregate([
            { $group: { _id: '$plushieType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({ plushieRanking: plushieOrders });
    } catch (error) {
        console.error('Error fetching plushie ranking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/plushie/:plushieId', verifyToken, async (req, res) => {
    try {
        const plushieId = req.params.plushieId;
        await StuffedAnimal.findByIdAndDelete(plushieId);
        res.status(200).json({ message: 'Plushie deleted successfully' });
    } catch (error) {
        console.error('Error deleting plushie:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;     