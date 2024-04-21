const StuffedAnimal = require('./stuffedAnimal');

async function deleteStuffedAnimal(stuffedAnimalId) {
    try {
        await connectToDatabase();
        
        const deletedStuffedAnimal = await StuffedAnimal.findByIdAndDelete(stuffedAnimalId);

        if (!deletedStuffedAnimal) {
            console.log('Stuffed animal not found');
            return;
        }

        console.log('Stuffed animal deleted successfully:', deletedStuffedAnimal);
    } catch (error) {
        console.error('Error deleting stuffed animal:', error);
    }
}

// Extract command-line arguments
const [, , stuffedAnimalId] = process.argv;

// Calls deleteStuffedAnimal function with provided argument
deleteStuffedAnimal(stuffedAnimalId);
