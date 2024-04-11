const Cart = require('../models/cart');

// Add product to cart
async function addToCart(userId, productId, quantity) {
    try {
        const cartItem = await Cart.findOneAndUpdate(
            { userId, productId },
            { $inc: { quantity } }, // Increment quantity if item already exists
            { upsert: true, new: true } // Create new cart item if it doesn't exist
        );
        return cartItem;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

// Get cart items for a user
async function getCartItems(userId) {
    try {
        const cartItems = await Cart.find({ userId }).populate('productId');
        return cartItems;
    } catch (error) {
        console.error('Error getting cart items:', error);
        throw error;
    }
}

// Update cart item quantity
async function updateCartItemQuantity(userId, productId, quantity) {
    try {
        const cartItem = await Cart.findOneAndUpdate(
            { userId, productId },
            { quantity },
            { new: true }
        );
        return cartItem;
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        throw error;
    }
}

// Remove item from cart
async function removeFromCart(userId, productId) {
    try {
        await Cart.findOneAndDelete({ userId, productId });
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}

module.exports = { addToCart, getCartItems, updateCartItemQuantity, removeFromCart };