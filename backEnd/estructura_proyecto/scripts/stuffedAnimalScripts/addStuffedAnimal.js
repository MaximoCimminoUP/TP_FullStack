const StuffedAnimal = require('./stuffedAnimal');

async function addStuffedAnimal(id, species, model, colours, stock) {
    try {
      const plushy = new StuffedAnimal({
        id,
        species,
        model,
        coloursAvailable: colours.split(','),
        stock
      });
      await plushy.save();
      console.log('Data inserted successfully:', plushy);
    } catch (error) {
      console.error('Error inserting data:', error);
    } 
  }
  
  // Extracts the command-line arguments
  const [, , id, species, model, colours, stock] = process.argv;
  
  // Calls the insertPlushData function with provided arguments
  addStuffedAnimal(id, species, model, colours, stock);