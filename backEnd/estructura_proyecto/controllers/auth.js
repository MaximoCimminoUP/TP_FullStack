const Usr = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (name, email, password) => {
    try {
        // Check if user with the same email already exists
        const existingUser = await Usr.findOne({ email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new Usr({
            name,
            email,
            password: hashedPassword,
            isActive: true // Assuming newly registered users are active by default
        });

        // Save the new user to the database
        await newUser.save();

        // Return the newly registered user (optional)
        return newUser;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error; // Throw error for handling in caller function
    }
};
const login = async (email, password) => {
    try {
        // Find user by email
        const user = await Usr.findOne({ email: email, isActive: true });
        
        // If user =! or password =!
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null; // Return null if auth fails
        }

        // Sign JWT token
        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });

        return token; // Return token on successful authentication
    } catch (error) {
        console.error('Error during login:', error);
        throw error; // Throw error for handling in caller function
    }
}


module.exports = { register, login };