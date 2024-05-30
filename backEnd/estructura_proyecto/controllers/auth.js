const Usr = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usrs = require('../models/user');



const login = async (email, password) => {
    try {
        // Find user by email
        const user = await usrs.findOne({ email: email, isActive: true });
        // If user does not exist
        
        if (!user) {
            return null; // Return null if user does not exist
        }
        console.log(user.password);
        // Compare provided password with hashed password stored in the database using bcrypt
        const passwordComp = require('crypto').createHash('sha256').update(password).digest('hex');
        if (user.password != passwordComp)
        {
            return null;
        }
        //if (user.role == 'admin'){}
        // Authentication successful, generate JWT token
        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
        console.log(token);
        return token; // Return token on successful authentication
    } catch (error) {
        console.error('Error during login:', error);
        throw error; // Throw error for handling in the caller function
    }
}

module.exports = { login };