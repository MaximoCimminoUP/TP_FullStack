const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rankingSchema = new Schema({
    model: {
        type: String,
        required: true,
        unique: true, // Ensures that the model field is unique
    },
    isActive: {
        type: Boolean,
        required: true
    },
    purchases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchases'
    }]
});

const Ranking = mongoose.model('Ranking', rankingSchema);

module.exports = Ranking;
