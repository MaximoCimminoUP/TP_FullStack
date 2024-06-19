const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, 
        index: { dropDups: true }
    },
    evolutions: {
        type: [String],
        required: true,
        validate: {
            validator: function (value) {
                return Array.isArray(value); 
            },
            message: 'Evolutions should be an array of strings'
        }
    },
    image: {
        type: String,
        required: true
    },
    shinyImage: {
        type: String
    },
    isShiny: {
        type: Boolean
    },
    accessories: {
        type: [{
            name: String,
            image: String
        }],
        required: true,
        validate: {
            validator: function (value) {
                return value.length >= 0; 
            },
            message: 'Accessories cannot be less than 0'
        }
    },
    
    isBaseEvolution: {
        type: Boolean,
        required: true,
        default: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative']
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usr',
        required: true
    },
    items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = Cart;
