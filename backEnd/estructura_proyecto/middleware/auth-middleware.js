
    const jwt = require('jsonwebtoken');
    require('dotenv').config();
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const verify = (req, res, next) => {
        try {
            const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;
            if (!token) {
                throw new Error('Authorization token missing');
            }
    
            console.log(`Token received: ${token}`);
            console.log(`Secret Key: ${JWT_SECRET_KEY}`);
    
            const decoded = jwt.verify(token, JWT_SECRET_KEY);
            console.log('Decoded token:', decoded);
    
            req.token = decoded;
            console.log("successful token interaction");
            next();
        } catch (error) {
            console.log(`Error in the middleware. Error: ${error.message}`);
            res.status(401).send('Not authorized');
        }
    };

    module.exports = { verify };