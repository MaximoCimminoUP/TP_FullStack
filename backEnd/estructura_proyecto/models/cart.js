const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    pokemonName: {
        type: String, 
        ref: 'Pokemon',
        required: false
    },
    quantity: {
        type: Number,
        required: false,
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
