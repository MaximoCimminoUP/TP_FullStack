const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth-middleware');
const User = require('../models/user');
const StuffedAnimal = require('../models/stuffedAnimal');
const Cart = require('../models/cart')

router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Fetch user details using userId extracted from JWT token
        const user = await User.findById(req.userId).select('-password');

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


router.post('/customize-stuffedAnimal', verifyToken, async (req, res) => {
    try {
        const {type, colors, accessories } = req.body;

        // create new custom plush
        const newStuffedAnimal = new StuffedAnimal({
            
            userId: req.userId, //takes user
            type,
            colors,
            accessories,
            stock: 1 // it assumes that once created, you will order 1. So it creates a single stock item for i.
        });

        const savedStuffedAnimal = await newStuffedAnimal.save();

        let cart = await Cart.findOne({ userId: req.userId });

        // If user doesn't have a cart, create a new one
        if (!cart) {
            cart = new Cart({
                userId: req.userId,
                items: [] // Initializes an empty array of cart items
            });
        }

        // Adds the new stuffed animal to the user's cart
        cart.items.push({ productId: savedStuffedAnimal._id, quantity: 1 });

        // Save the updated cart
        await cart.save();
        res.status(200).json({ message: 'Plushie customized successfully', plushie: savedStuffedAnimal});
    } catch (error) {
        console.error('Error customizing stuffed animal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/stuffedAnimal-ranking', async (req, res) => {
    try {
        // Add orders to count the number of orders for each plushie type
        const stuffedAnimalOrders = await Order.aggregate([
            { $group: { _id: '$stuffedAnimalType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({ plushieRanking: plushieOrders });
    } catch (error) {
        console.error('Error fetching stuffed animal ranking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/plushie/:plushieId', verifyToken, async (req, res) => {
    try {
        const plushieId = req.params.stuffedAnimalId;
        await StuffedAnimal.findByIdAndDelete(plushieId);
        res.status(200).json({ message: 'Plushie deleted successfully' });
    } catch (error) {
        console.error('Error deleting plushie:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;     