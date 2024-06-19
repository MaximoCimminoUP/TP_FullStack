const Pokemon = require('../models/stuffedAnimal');

const addPokemon = async (name, evolutions, image, shinyImage, accessories, stock) => {
    try {
        const pokemon = new Pokemon({
            name,
            evolutions,
            image,
            shinyImage,
            accessories,
            stock,
            isBaseEvolution
        });
        const savedPokemon = await pokemon.save();
        return savedPokemon;
    } catch (error) {
        console.error('Error adding Pokémon:', error);
        throw error;
    }
};

const getAllPokemons = async (limit, offset) => {
        const pokemons = await Pokemon.find({ isBaseEvolution: true }).limit(limit).skip(offset);
        return pokemons;
   
};

const getPokemonById = async (id) => {
    try {
        const pokemon = await Pokemon.findById(id);
        return pokemon;
    } catch (error) {
        console.error('Error getting Pokémon by ID:', error);
        throw error;
    }
};

const editPokemon = async (id, updatedPokemon) => {
    try {
        const editedPokemon = await Pokemon.findByIdAndUpdate(id, updatedPokemon, { new: true });
        return editedPokemon;
    } catch (error) {
        console.error('Error editing Pokémon:', error);
        throw error;
    }
};

const deletePokemon = async (id) => {
    try {
        const deletedPokemon = await Pokemon.findByIdAndDelete(id);
        return deletedPokemon;
    } catch (error) {
        console.error('Error deleting Pokémon:', error);
        throw error;
    }
};

module.exports = { addPokemon, getAllPokemons, getPokemonById, editPokemon, deletePokemon };
