
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


const login = async (req) => {
    const email = req.body.email;
    const password = req.body.password;

    const cryptoPass = require('crypto')
        .createHash('sha256')
        .update(password)
        .digest('hex');
    const user = await Users.findOne({ email: email, isActive: true, password: cryptoPass });
    
    if (user) {
        const token = jwt.sign({ userId: user._id },JWT_SECRET_KEY, { expiresIn: '1h' });
        return { email, token, userId: user._id };
    } else {
        return null;
    }
}


module.exports = { login };