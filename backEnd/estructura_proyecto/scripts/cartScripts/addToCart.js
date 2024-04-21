const User = require('./user');
const StuffedAnimal = require('./stuffedAnimal');

async function addToCart(userId, stuffedAnimalId) {
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
            return;
        }

        // Find the stuffed animal by ID
        const stuffedAnimal = await StuffedAnimal.findById(stuffedAnimalId);

        if (!stuffedAnimal) {
            console.log('Stuffed animal not found');
            return;
        }

        // Add the stuffed animal to the user's cart
        user.cart.push(stuffedAnimal);

        // Save the updated user object
        await user.save();

        console.log('Stuffed animal added to cart successfully:', user);
    } catch (error) {
        console.error('Error adding stuffed animal to cart:', error);
    }
}

// Extract command-line arguments for user ID and stuffed animal ID
const [, , userId, stuffedAnimalId] = process.argv;

// Call addToCart function with provided argument
addToCart(userId, stuffedAnimalId);