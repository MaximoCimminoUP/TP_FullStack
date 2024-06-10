const mongoose = require('mongoose');

const purchasesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1 // Default quantity is 1
    },
    purchaseDate: {
        type: Date,
        default: Date.now // Default to the current date and time
    }
});

const Purchases = mongoose.model('Purchases', purchasesSchema);

module.exports = Purchases;
