const Purchases = require('../models/purchases');

const getAllPurchases = async (userId, limit, offset) => {
    try {
        const purchases = await Purchases.find({ userId }).populate('items');
        return purchases;
    } catch (error) {
        console.error('Error getting all purchases:', error);
        throw error;
    }
};

module.exports = { getAllPurchases };