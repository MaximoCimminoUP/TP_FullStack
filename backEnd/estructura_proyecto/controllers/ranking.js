const mongoose = require('mongoose');
const Purchases = require('../models/purchases');
const Pokemon = require('../models/stuffedAnimal');

const getMostPopular = async () => {
    try {
        // Step 1: Unwind the items array in Purchases
        let intermediateResult = await Purchases.aggregate([{ $unwind: '$items' }]);
        console.log('After Unwind (Purchases):', intermediateResult); // Debug: Log after unwind

        // Step 2: Group by Pokémon name and shiny state, sum quantity
        intermediateResult = await Purchases.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: { name: '$items.name', isShiny: '$items.isShiny' },
                    totalQuantity: { $sum: '$items.quantity' }
                }
            }
        ]);
        console.log('After Group (Purchases):', intermediateResult); // Debug: Log after group

        // Step 3: Sort by total quantity in descending order
        intermediateResult = await Purchases.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: { name: '$items.name', isShiny: '$items.isShiny' },
                    totalQuantity: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalQuantity: -1 } }
        ]);
        console.log('After Sort (Purchases):', intermediateResult); // Debug: Log after sort

        // Step 4: Limit to top 3 results from Purchases
        intermediateResult = await Purchases.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: { name: '$items.name', isShiny: '$items.isShiny' },
                    totalQuantity: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 3 }
        ]);
        console.log('After Limit (Purchases):', intermediateResult); // Debug: Log after limit

        // Step 5: Fetch all Pokemon data without filtering by isShiny
        const pokemonData = await Pokemon.find({}).select('name isShiny image shinyImage');
        console.log('Pokemon Data:', pokemonData); // Debug: Log fetched Pokemon data

        // Step 6: Merge Purchases results with Pokemon data
        const mergedResults = intermediateResult.map(result => {
            const pokemon = pokemonData.find(p => p.name === result._id.name);
            return {
                name: result._id.name,
                isShiny: result._id.isShiny, // Retaining isShiny from Purchases aggregation result
                totalQuantity: result.totalQuantity,
                image: pokemon ? pokemon.image : null,
                shinyImage: pokemon ? pokemon.shinyImage : null
            };
        });

        console.log('Merged Results:', mergedResults); // Debug: Log merged results

        // Return the final merged results
        return mergedResults;
    } catch (error) {
        console.error('Error in getMostPopular:', error); // Debug: Log any errors
        throw error;
    }
};
module.exports = { getMostPopular };
