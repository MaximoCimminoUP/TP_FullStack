const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { getAllStuffedAnimals } = require("../controllers/stuffedAnimal");


// Protected route
router.get('/auth/home', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
    console.log("Welcome to the Custom Plush webpage!")
    getAllStuffedAnimals();
    
    });
    

