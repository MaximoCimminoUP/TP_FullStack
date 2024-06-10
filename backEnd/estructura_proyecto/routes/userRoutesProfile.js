const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth-middleware');
const User = require('../models/user');
const StuffedAnimal = require('../models/stuffedAnimal');
const Cart = require('../models/cart')
const Purchase = require("../models/purchases")
router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Fetches user details using userId extracted from JWT token
        const user = await User.findById(req.userId).select('-password');

        // Checks if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Returns user details
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/customize-stuffedAnimal', verifyToken, async (req, res) => {
    try {
        const {type, colors, accessories } = req.body;

        // creates new custom plush
        const newStuffedAnimal = new StuffedAnimal({
            
            userId: req.userId, //takes user
            type,
            colors,
            accessories,
            stock: 1 // assumes that once created, you will order 1. So it creates a single stock item for i.
        });

        const savedStuffedAnimal = await newStuffedAnimal.save();

        let cart = await Cart.findOne({ userId: req.userId });

        // If user doesn't have a cart, it creates a new one
        if (!cart) {
            cart = new Cart({
                userId: req.userId,
                items: [] // Initializes an empty array of cart items
            });
        }

        // Adds the new stuffed animal to the user's cart
        cart.items.push({ productId: savedStuffedAnimal._id, quantity: 1 });

        // Saves the updated cart
        await cart.save();
        res.status(200).json({ message: 'Plushie customized successfully', plushie: savedStuffedAnimal});
    } catch (error) {
        console.error('Error customizing stuffed animal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/stuffedAnimal-ranking', async (req, res) => {
    try {
        // Adds orders to count the number of orders for each plushie type
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

router.get('/cart', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/cart/add', verifyToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            cart = new Cart({
                userId: req.userId,
                items: []
            });
        }
   
        const existingItem = cart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/cart/remove/:productId', verifyToken, async (req, res) => {
    try {
        const productId = req.params.productId;
        let cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        // Removes the item from the cart
        cart.items = cart.items.filter(item => item.productId !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/purchases', async (req, res) => {
    try {
      // Fetches purchase history from the database
      const purchases = await Purchase.find({ userId: req.user.id }).populate('stuffedAnimal');
  
      // Sends the purchases as a response
      res.json(purchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;     