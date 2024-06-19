const express = require('express');
const router = express.Router(); 
const verify = require('../middleware/auth-middleware');
const User = require('../models/user');
const Pokemon = require('../models/stuffedAnimal');
const Cart = require('../models/cart');
const Purchases = require('../models/purchases');
const bodyParser = require('body-parser');
const Middleware  = require('../middleware/auth-middleware');
const Ranking = require('../models/ranking');
const { getMostPopular } = require('../controllers/ranking');
const { boolean } = require('yargs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const{addToCart, fetchCartItems} = require('../controllers/cart')
const{getAllPurchases} = require('../controllers/purchases.js')

router.get('/profile', Middleware.verify, async (req, res) => {
   
    try {
        // Fetches user details using userId extracted from JWT token
        const user = await User.findById(req.token.userID).select('-password');

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
// Endpoint to get all Pokémon stuffed animals owned by a user
router.get('/UserPokemons', Middleware.verify, async (req, res) => {
    try {
        const myPokemons = await Purchases.find({userId: req.token.userID}).populate('productId');
        res.status(200).json({ myPokemons });
    } catch (error) {
        console.error('Error fetching user Pokémons:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/customize-pokemon', Middleware.verify, async (req, res) => {
    try {
        const { type, image, shinyImage, isShiny, accessories, quantity } = req.body;
        const userId = req.token.userId;

        // Validate required fields
        if (!type || !image || !accessories ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Use addToCart function to add the item to the cart
        const savedCartItem = await addToCart(userId, type, accessories, isShiny, quantity);

        res.status(200).json({ message: 'Pokemon customized successfully', cartItem: savedCartItem });
    } catch (error) {
        console.error('Error customizing Pokemon:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/pokemon-ranking', async (req, res) => {
    try {
        
        const mostPopular = await getMostPopular();

        // Format the response to match the expected structure
        const pokemonRanking = mostPopular.map((item, index) => ({
            _id: index + 1, 
            model: item.model,
            count: item.requestCounter 
        }));

        res.status(200).json({ pokemonRanking });
    } catch (error) {
        console.error('Error fetching plushie ranking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/cart', Middleware.verify, async (req, res) => {
    try {
        const userId = req.token.userId;
        console.log('The user logging into the cart is:', userId);

        const cartItems = await fetchCartItems(userId); // Fetch cart items for the user

        res.status(200).json({ items: cartItems }); // Respond with cart items in the correct format
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/cart/add', Middleware.verify, async (req, res) => {
    try { 
        console.log('POST /cart/add');
        console.log('Request Body:', req.body); 

        const { userID, pokemonName, quantity, isShiny, accessories } = req.body; 

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ userID });
        if (!cart) {
            console.log('Creating new cart for user ID:', userID);
            cart = new Cart({
                userID,
                items: []
            });
        }

        // Check if the item already exists in the cart
        const existingItem = cart.items.find(item => item.pokemonName === pokemonName && item.isShiny === isShiny && arraysEqual(item.accessories, accessories));
        if (existingItem) {
            // Update the quantity of the existing item
            existingItem.quantity += quantity;
        } else {
            // Add a new item to the cart
            cart.items.push({ pokemonName, quantity, isShiny, accessories });
        }

        // Save the updated cart
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to compare arrays for accessory comparison
function arraysEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

router.delete('/cart/remove/:name', Middleware.verify, async (req, res) => {
    try {
        const pokemonName = req.params.name;
        const userId = req.token.userId;

        let cart = await Cart.findOne({ userId});
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        // Removes the item from the cart
        cart.items = cart.items.filter(item => item.name !== pokemonName);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


    
});
router.delete('/cart/remove', Middleware.verify, async (req, res) => {
    try {
        const userId = req.token.userId;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Remove all items from the cart
        cart.items = [];
        
        await cart.save();

        res.status(200).json({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/purchase', Middleware.verify, async (req, res) => {
    try {
        const { cartItems } = req.body;
        const userId = req.token.userId;

        console.log('Received cartItems:', cartItems);

        // Iterate through each cart item and process the purchase
        for (const item of cartItems) {
            const { name, accessories, isShiny, quantity } = item;

            console.log(`Processing item: ${name}, Quantity: ${quantity}, Shiny: ${isShiny}`);

            // Find the Pokémon in the database
            const pokemon = await Pokemon.findOne({ name: name });
            if (!pokemon) {
                return res.status(404).json({ error: `Pokémon ${name} not found` });
            }

            // Determine if the item is shiny or not
            const purchaseItem = {
                name: pokemon.name,
                evolutions: pokemon.evolutions,
                image: pokemon.image,
                shinyImage: isShiny ? pokemon.shinyImage : null, // Set shinyImage only if isShiny is true
                isShiny: isShiny,
                accessories: accessories,
                isBaseEvolution: pokemon.isBaseEvolution,
                quantity: quantity  // Ensure quantity is correctly passed here
            };

            console.log('Constructed purchaseItem:', purchaseItem);

            // Check if this item already exists in the user's Purchases
            const filter = {
                userId: userId,
                'items.name': name,
                'items.isShiny': isShiny 
            };

            const existingPurchaseItem = await Purchases.findOne(filter);

            if (existingPurchaseItem) {
                // Find the correct item within the items array by name and isShiny
                const itemToUpdate = existingPurchaseItem.items.find(item => item.name === name && item.isShiny === isShiny);
                if (itemToUpdate) {
                    // If item exists, update its quantity
                    const updateFilter = {
                        userId: userId,
                        'items._id': itemToUpdate._id  // Use the _id of the existing item
                    };

                    const update = { $inc: { 'items.$.quantity': quantity } };

                    await Purchases.updateOne(updateFilter, update);

                    console.log(`Updated existing item: ${name}, Shiny: ${isShiny}, Quantity: ${quantity}`);
                } else {
                    // If item with the exact name and isShiny doesn't exist, push new item to array
                    await Purchases.findOneAndUpdate(
                        { userId: userId },
                        { $push: { items: purchaseItem } },
                        { upsert: true }
                    );

                    console.log(`Added new item to Purchases: ${name}, Shiny: ${isShiny}, Quantity: ${quantity}`);
                }
            } else {
                // If no items found for user, create a new purchase with the item
                await Purchases.create({
                    userId: userId,
                    items: [purchaseItem]
                });

                console.log(`Added new item to Purchases: ${name}, Shiny: ${isShiny}, Quantity: ${quantity}`);
            }
        }

        // Respond with success message
        res.status(200).json({ message: 'Purchase successful!' });
    } catch (error) {
        // Handle errors
        console.error('Error during purchase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/purchases', Middleware.verify, async (req, res) => {
    try {
        const userId= req.token.userId;

        const purchases = await getAllPurchases(userId, 10, 0);
        res.json(purchases);
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;     