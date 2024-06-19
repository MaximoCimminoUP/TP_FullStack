const Cart = require('../models/cart');
const Users = require('../models/user')
const Pokemon = require('../models/stuffedAnimal.js')
async function newCart(userId){
    const cart = new Cart(
        { userId: userId,
          items:[]                 
        }
    );
    let cartStart = await Cart.findOne({ userId});
    console.log('Looking for cart with userId:', userId);
     console.log('Found cart with userId:', cart ? cart.userId : 'None');
    console.log(cartStart);
    return { cartStart }; 


}   
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// Adds product to cart
async function addToCart(userId, name, accessories, isShiny, quantity) {
    try {
        const user = await Users.findById(userId);
        const pokemon = await Pokemon.findOne({ name });
        
        // Log user and pokemon details for debugging
        console.log('User:', user);
        console.log('Pokemon Name:', pokemon ? pokemon.name : 'Not found');

        if (!user || !pokemon) {
            throw new Error('User or Pokémon not found', { user, pokemon });
        }

        const cartItem = {
            name: pokemon.name,
            evolutions: pokemon.evolutions,
            image: pokemon.image,
            shinyImage: pokemon.shinyImage || '',
            isShiny: isShiny || false,
            accessories: accessories,
            isBaseEvolution: pokemon.isBaseEvolution,
            quantity: quantity
        };

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId });
        }

        // Checks if the item already exists in the cart
        const existingCartItem = cart.items.find(item => (
            item.name === cartItem.name &&
            item.isShiny === cartItem.isShiny &&
            arraysEqual(item.accessories, cartItem.accessories)
        ));

        if (existingCartItem) {
            // Increments the quantity of the existing item in the cart
            existingCartItem.quantity += quantity;
        } else {
            // Adds a new item to the cart
            cart.items.push(cartItem);
        }

        await cart.save();

        console.log('Item added to cart:', cartItem);
        return cartItem;
    } catch (error) {
        console.error('Error adding item to cart:', error);
        throw error;
    }
}

async function fetchCartItems(userId) {
    try {
        const cart = await Cart.findOne({ userId }).populate('items');

        if (!cart) {
            throw new Error('Cart not found');
        }

        // Return the cart items with all necessary details
        return cart.items.map(item => ({
            name: item.name,
            evolutions: item.evolutions,
            image: item.image,
            shinyImage: item.shinyImage,
            isShiny: item.isShiny,
            accessories: item.accessories,
            isBaseEvolution: item.isBaseEvolution,
            quantity: item.quantity
        }));
    } catch (error) {
        console.error('Error fetching cart items:', error);
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
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            throw new Error('Cart not found');
        }

        // Filter out the item to remove from the items array
        cart.items = cart.items.filter(item => item.productId.toString() !== productId.toString());

        // Save the updated cart
        await cart.save();
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}

module.exports = { addToCart, fetchCartItems, updateCartItemQuantity, removeFromCart, newCart };