const connectToDatabase = require('./db');
const StuffedAnimal = require('./stuffedAnimal');

async function updateStuffedAnimal(stuffedAnimalId, updatedInfo) {
    try {
        // Finds the stuffed animal by ID and updates the data
        const updatedStuffedAnimal = await StuffedAnimal.findByIdAndUpdate(stuffedAnimalId, updatedInfo, { new: true });

        if (!updatedStuffedAnimal) {
            console.log('Stuffed animal not found');
            return;
        }

        console.log('Stuffed animal data updated successfully:', updatedStuffedAnimal);
    } catch (error) {
        console.error('Error updating stuffed animal data:', error);
    }
}

// Extracts command-line arguments
const [, , stuffedAnimalId, species, model, coloursAvailable, stock] = process.argv;

// Creates an object with the updated data
const updatedInfo = {
    species,
    model,
    coloursAvailable: coloursAvailable.split(','),
    stock,
};

updateStuffedAnimal(stuffedAnimalId, updatedInfo);
