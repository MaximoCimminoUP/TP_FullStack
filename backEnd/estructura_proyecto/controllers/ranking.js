const mongoose = require('mongoose');
const Purchases = require('../models/purchases');
const Ranking = require('../models/ranking');

const getMostPopular = async () => {
    const mostPopular = await Purchases.aggregate([
        {
            $lookup: {
                from: 'rankings',
                localField: 'productId',
                foreignField: '_id',
                as: 'rankingDetails'
            }
        },
        { $unwind: '$rankingDetails' },
        { $match: { 'rankingDetails.isActive': true } },
        {
            $group: {
                _id: '$productId',
                totalQuantity: { $sum: '$quantity' }
            }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 3 },
        {
            $lookup: {
                from: 'rankings',
                localField: '_id',
                foreignField: '_id',
                as: 'rankingDetails'
            }
        },
        { $unwind: '$rankingDetails' },
        {
            $project: {
                _id: 0,
                model: '$rankingDetails.model',
                requestCounter: '$totalQuantity'
            }
        }
    ]);
    return mostPopular;
}

module.exports = { getMostPopular };
