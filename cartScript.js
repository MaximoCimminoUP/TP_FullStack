const mongoose = require('mongoose');
const Cart = require('../TP_FullStack/backEnd/estructura_proyecto/models/cart'); // Adjust path and model name as per your application
require('dotenv').config();
const URI = process.env.URI;
async function updateCartItems() {
    try {
        // Connect to MongoDB
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const carts = await Cart.find({ 'items.0': { $exists: true } });

        // Iterate through each cart
        for (let cart of carts) {
            // Update each item in the cart to include the 'quantity' field
            for (let item of cart.items) {
                if (!item.quantity) {
                    item.quantity = 1; // Set a default value or adjust as needed
                }

                // Deduct stock from the corresponding Pokemon
                const pokemon = await Pokemon.findOne({ name: item.name });
                if (pokemon) {
                    pokemon.stock -= item.quantity;
                    await pokemon.save();
                    console.log(`Updated stock for ${pokemon.name}: ${pokemon.stock}`);
                } else {
                    console.log(`Pokemon ${item.name} not found.`);
                }
            }

            // Save the updated cart
            await cart.save();
            console.log(`Updated cart with userId ${cart.userId}`);
        }

        console.log('All carts updated successfully!');
    } catch (error) {
        console.error('Error updating carts:', error);
    } finally {
        // Disconnect from MongoDB
        mongoose.disconnect();
    }
}

// Run the update function
updateCartItems();