const Cart = require('./cart');

async function deleteCart(userId, productId) {
    try {
        // Find and delete the cart item by user ID and product ID
        const deletedCartItem = await Cart.findOneAndDelete({ userId, productId });

        if (!deletedCartItem) {
            console.log('Cart item not found');
            return;
        }

        console.log('Cart item deleted successfully:', deletedCartItem);
    } catch (error) {
        console.error('Error deleting cart item:', error);
    }
}

// Extract command-line arguments
const [, , userId, productId] = process.argv;

deleteCart(userId, productId);