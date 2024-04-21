const Cart = require('./cart');

async function updateCart(userId, productId, quantity) {
    try {
        // Find the user's cart item by user ID and product ID
        let cartItem = await Cart.findOne({ userId, productId });

        if (!cartItem) {
            // If cart item does not exist, create a new one
            cartItem = new Cart({ userId, productId, quantity });
        } else {
            // If cart item exists, update the quantity
            cartItem.quantity = quantity;
        }

        // Save the updated cart item to the database
        await cartItem.save();

        console.log('Cart updated successfully:', cartItem);
    } catch (error) {
        console.error('Error updating cart:', error);
    }
}

// Extract command-line arguments
const [, , userId, productId, quantity] = process.argv;

updateCart(userId, productId, quantity);
