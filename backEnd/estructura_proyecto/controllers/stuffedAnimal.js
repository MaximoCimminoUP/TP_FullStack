const StuffedAnimal = require('../models/stuffedAnimal');

const addStuffedAnimal = async (id, species, model, coloursAvailable, stock) => {
    try {
        const stuffedAnimal = new StuffedAnimal({
            id,
            species,
            model,
            coloursAvailable,
            stock
        });
        const savedStuffedAnimal = await stuffedAnimal.save();
        return savedStuffedAnimal;
    } catch (error) {
        console.error('Error adding stuffed animal:', error);
        throw error;
    }
};


const getAllStuffedAnimals = async (limit, offset) => {
    try {
        const stuffedAnimals = await StuffedAnimal.find({}).limit(limit).skip(offset);
        return stuffedAnimals;
    } catch (error) {
        console.error('Error getting all stuffed animals:', error);
        throw error;
    }
};



const getStuffedAnimalById = async (id) => {
    try {
        
        const stuffedAnimal = await StuffedAnimal.findOne({id: id});
        return stuffedAnimal;
    } catch (error) {
        console.error('Error getting stuffed animal by ID:', error);
        throw error;
    }
};

const editStuffedAnimal = async (stuffedAnimal) => {
    try {
        
        const updatedStuffedAnimal = await StuffedAnimal.findOneAndUpdate(
            { id: stuffedAnimal.id }, // Filters to find the stuffed animal by its ID
            stuffedAnimal, // Data to update
            { new: true } // Returns the modified document rather than the original
        );
        
        return updatedStuffedAnimal;
    } catch (error) {
        console.error('Error editing stuffed animal:', error);
        throw error;
    }
};

const deleteStuffedAnimal = async (id) => {
    try {
        const deletedStuffedAnimal = await StuffedAnimal.findOneAndDelete({id: id});
        return deletedStuffedAnimal;
    } catch (error) {
        console.error('Error deleting stuffed animal:', error);
        throw error;
    }
};

module.exports = { addStuffedAnimal, getAllStuffedAnimals, getStuffedAnimalById, editStuffedAnimal, deleteStuffedAnimal };
