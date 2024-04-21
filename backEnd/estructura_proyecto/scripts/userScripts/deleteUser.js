
const User = require('./user');

async function deleteUser(userId) {
    try {
        // Finds the user by ID and deletes it
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            console.log('User not found');
            return;
        }

        console.log('User deleted successfully:', deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Extracts command-line argument for user ID
const [, , userId] = process.argv;

// Calls deleteUser function with provided argument
deleteUser(userId);