const jwt = require('jsonwebtoken');
const express = require('express');
const app = express.Router();
const { getAllPokemons } = require("../controllers/stuffedAnimal");

const cors = require('cors');
app.use(cors());

// Protected route
app.get('/auth/home', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
    console.log("Welcome to the Custom Plush webpage!")
    getAllPokemons();
    
    });
    

