const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StuffedAnimal',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Sale = mongoose.model('Sale', saleSchema); 

module.exports = Sale;