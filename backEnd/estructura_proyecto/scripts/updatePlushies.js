//scripts that the ADMIN can use from the command line to simplify db updates. 
const axios = require('axios');

// Replace these variables with your actual values
const teddyId = '123456789'; // ID of the teddy bear to update
const coloursAvailable = ['Red', 'Blue', 'Green']; // Updated colour options

const apiUrl = 'http://localhost:8080'; // URL of your backend server

// Function to update plushy  details
async function updatePlushie() {
    try {
        const response = await axios.put(`${apiUrl}/teddies/${teddyId}`, { coloursAvailable });
        console.log('Teddy bear details updated successfully:', response.data);
    } catch (error) {
        console.error('Error updating teddy bear:', error.response ? error.response.data : error.message);
    }
}


updatePlushie();