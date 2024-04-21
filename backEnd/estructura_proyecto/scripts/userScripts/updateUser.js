const connectToDatabase = require('./db');
const User = require('./user');

async function updateUser(userId, newData) {
    try {
        // Finds the user by ID and updates the data
        const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true });

        if (!updatedUser) {
            console.log('User not found');
            return;
        }

        console.log('User data updated successfully:', updatedUser);
    } catch (error) {
        console.error('Error updating user data:', error);
    }
}

// Extracts command-line arguments
const [, , userId, email, name, lastname, isActive, roles, password] = process.argv;

// Creates an object with the updated data
const newData = {
    email,
    name,
    lastname,
    isActive,
    roles: roles.split(','),
    password,
};

updateUser(userId, newData);
