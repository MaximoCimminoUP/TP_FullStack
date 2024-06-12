const express = require('express');
const router = express.Router(); // Create a new router instance

const verifyToken = require('../middleware/auth-middleware');
const User = require('../models/user');
const Pokemon = require('../models/stuffedAnimal');
const Cart = require('../models/cart');
const Purchases = require('../models/purchases');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

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

router.post('/customize-pokemon', verifyToken, async (req, res) => {
    try {
        const { type, colors, accessories } = req.body;

        // Creates a new custom Pokemon
        const newPokemon = new Pokemon({
            userId: req.userId, 
            name: type, // Assuming 'type' represents the Pokemon name
            evolutions: [], 
            image: '', // Image URL for the Pokemon
            accessories,
            stock: 1 // Assumes that once created, you will order 1. So it creates a single stock item for it.
        });

        const savedPokemon = await newPokemon.save();

        let cart = await Cart.findOne({ email: req.email });

        // If user doesn't have a cart, it creates a new one
        if (!cart) {
            cart = new Cart({
                email: req.email,
                 
            });
        }

        // Adds the new Pokemon to the user's cart
        cart.items.push({ productId: savedPokemon._id, quantity: 1 });

        // Saves the updated cart
        await cart.save();
        res.status(200).json({ message: 'Pokemon customized successfully', pokemon: savedPokemon });
    } catch (error) {
        console.error('Error customizing Pokemon:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/pokemon-ranking', async (req, res) => {
    try {
        // Adds orders to count the number of orders for each Pokemon type
        const pokemonOrders = await Purchases.aggregate([
            { $group: { _id: '$productId', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({ pokemonRanking: pokemonOrders });
    } catch (error) {
        console.error('Error fetching Pokemon ranking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/cart', verifyToken, async (req, res) => {
    try {
        const { email } = req.body; // Extract email from request body

        const cart = await Cart.findOne({ email });
        console.log(email);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/cart/add', async (req, res) => {
    try { 
        console.log('POST /cart/add');
        console.log('Request Body:', req.body); // Print the entire request body

        const { email, pokemonName, quantity } = req.body; // Extract email from req.body

        console.log('paso 1');
        const pokemon = await Pokemon.findOne({ name: pokemonName });
        if (!pokemon) {
            console.log('Pokemon not found:', pokemonName);
            return res.status(404).json({ error: 'Pokemon not found' });
        }  
        console.log('Found Pokemon:', pokemon);

        let cart = await Cart.findOne({ email: email }); // Use extracted email
        console.log('paso 3');
        if (!cart) {
            console.log('Creating new cart for email:', email);
            cart = new Cart({
                email: email,
                items: [] // Initialize items array
            });
        } else {
            console.log('Found existing cart for email:', email);
            if (!Array.isArray(cart.items)) {
                cart.items = []; // Ensure items is an array
            }
        }

        console.log('paso 4');
        const existingItem = cart.items.find(item => item.pokemonName === pokemonName);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ pokemonName: pokemonName, quantity });
        }
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/cart/remove/:pokemonName', verifyToken, async (req, res) => {
    try {
        const pokemonName = req.params.pokemonName;
        const email = req.user.email;

        let cart = await Cart.findOne({ email: email });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        // Removes the item from the cart
        cart.items = cart.items.filter(item => item.pokemonName !== pokemonName);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/purchase', verifyToken, async (req, res) => {
    try {
        const { cartItems } = req.body;
        const userId = req.userId;

        for (const item of cartItems) {
            const purchase = new Purchases({
                userId,
                productId: item.productId,
                quantity: item.quantity
            });
            await purchase.save();
        }

        res.status(200).json({ message: 'Purchase successful!' });
    } catch (error) {
        console.error('Error during purchase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/purchases', verifyToken, async (req, res) => {
    try {
        const purchases = await Purchases.find({ userId: req.userId }).populate('stuffedAnimal');
        res.json(purchases);
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;     