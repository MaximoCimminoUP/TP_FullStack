//scripts that the ADMIN can use from the command line to simplify db updates. 
const axios = require('axios');

// Replace these variables with your actual values
const teddyId = '123456789'; // ID of the teddy bear to update
const coloursAvailable = ['Red', 'Blue', 'Green']; // Updated colour options

const apiUrl = 'http://localhost:8080';

// Function to update plush  details
async function updatePlushie(teddyId,coloursAvailable) {
    try {
        const response = await axios.put(`${apiUrl}/stuffedAnimal/${teddyId}`, { coloursAvailable });
        console.log('Stuffed animal details updated successfully:', response.data);
    } catch (error) {
        console.error('Error updating stuffed animal:', error.response ? error.response.data : error.message);
    }
}


updatePlush();