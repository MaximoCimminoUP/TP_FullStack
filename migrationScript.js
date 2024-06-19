const mongoose = require('mongoose');
const Pokemon = require('../TP_FullStack/backEnd/estructura_proyecto/models/stuffedAnimal')
require('dotenv').config();
const URI = process.env.URI;

mongoose.connect(URI,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');

    try {
        const pokemons = await Pokemon.find({});
        
        for (const pokemon of pokemons) {
            if (pokemon.shinyImage === '' ) {
               pokemon.isShiny=false;
            } else{
                pokemon.isShiny = true;
            };

            await pokemon.save();
            console.log(`Updated ${pokemon.name}: isShiny = ${pokemon.isShiny}`);
        }

        console.log('All Pokémons updated successfully');
    } catch (error) {
        console.error('Error updating Pokémon:', error);
    } finally {
        mongoose.disconnect();
    }
}).catch((err) => console.error('MongoDB connection error:', err));