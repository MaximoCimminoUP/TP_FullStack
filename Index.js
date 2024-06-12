const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http").createServer(app);
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { login } = require('./backEnd/estructura_proyecto/controllers/auth.js');
const { addPokemon, getAllPokemons, getPokemonById, editPokemon, deletePokemon } = require("./backEnd/estructura_proyecto/controllers/stuffedAnimal");
const Pokemon = require('./backEnd/estructura_proyecto/models/stuffedAnimal.js');
const Purchases = require('./backEnd/estructura_proyecto/models/purchases.js');
const verifyToken = require('./backEnd/estructura_proyecto/middleware/auth-middleware.js');
const PORT = process.env.PORT || 8050;
const URI = process.env.URI;
app.use(express.json()); 
const { addUser } = require('./backEnd/estructura_proyecto/controllers/user');
const cors = require('cors');
const Cart = require('./backEnd/estructura_proyecto/models/cart.js');
app.use(cors());
const userRoutes = require('./backEnd/estructura_proyecto/routes/userRoutesProfile.js');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
app.use('/Api', userRoutes);

mongoose.connect(URI, {})
.then(() =>
    {
        console.log("MongoDB connected");
    }).catch((err) => console.log(err));




//Landing page route 
app.get("/", (req, res) => {
    
});

app.get("/home", (req, res) => {
    res.send("Hola");
});
app.post('/register', async (req, res) => {
    try {
        const { email, name, lastname, isActive, roles, password } = req.body;
        const result = await addUser(email, name, lastname, isActive, roles, password);
        tempEmail = email;
        if (result) {
            res.status(200).json({ message: 'User added successfully', user: result });
        } else {
            res.status(400).json({ error: 'User already exists' });
        }
        const newCart = new Cart({
           email: tempEmail,
        });

        // Save the cart
        await newCart.save();

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/login', async (req, res) => {
    
    const { email, password } = req.body;

    try {
        // Attempt to log in the user
        const token = await login(email, password);

        if (token) {
            // Login successful, send JWT token in response
            res.status(200).json({ token });
            
            let cart = await Cart.findOne({ userId: user._id });

        // If user doesn't have a cart, create a new one
        if (!cart) {
            cart = new Cart({
                userId: user._id,
                items: []
            });
            await cart.save();
        }
        } else {
            // Login failed, send appropriate error response
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/stock', async (req, res) => {
    try {
        const { name, evolutions, image, shinyImage, accessories, stock } = req.body;
        
        const newPokemon = new Pokemon({ 
            name, 
            evolutions, 
            image, 
            shinyImage,
            accessories,
            stock 
        });
        
        await newPokemon.save();
        
        res.status(200).json({ message: 'Pokémon stuffed animal added successfully' });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ error: 'Pokémon stuffed animal already exists' });
        } else {
            console.error('Error adding Pokémon:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
app.get('/pokemon', async (req, res) => {
    try {
        let pokemons = await Pokemon.find({}, '-_id -createdAt -updatedAt -__v')
        .populate({
          path: 'accessories',
          select: '-_id name image' // Excluding _id field from accessories
        })
        .lean(); // Convert to plain JavaScript objects
       
        pokemons = pokemons.map(pokemon => {
            if (pokemon.accessories) {
              pokemon.accessories = pokemon.accessories.map(accessory => {
                delete accessory._id;
                return accessory;
              });
            }
            return pokemon;
          });
          
      res.json(pokemons);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Endpoint to show Pokémon stuffed animals by ID
app.get('/pokemon/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pokemon = await Pokemon.findById(id);
        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon stuffed animal not found' });
        }
        
        return res.status(200).json(pokemon);
    } catch (error) {
        console.error('Error getting Pokémon by ID:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to edit the Pokémon stuffed animal by ID
app.put('/pokemon/:id', async (req, res) => {
    const id = req.params.id;
    const updatedPokemon = req.body;
    try {
        const result = await Pokemon.findByIdAndUpdate(id, updatedPokemon, { new: true });
        if (!result) {
            return res.status(404).json({ error: 'Pokémon stuffed animal not found' });
        }
        res.status(200).json({ message: 'Pokémon stuffed animal updated successfully', pokemon: result });
    } catch (error) {
        console.error('Error updating Pokémon:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to delete a Pokémon stuffed animal by ID
app.delete('/pokemon/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Pokemon.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'Pokémon stuffed animal not found' });
        }
        res.status(200).json({ message: 'Pokémon stuffed animal deleted successfully', pokemon: result });
    } catch (error) {
        console.error('Error deleting Pokémon:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get the ranking of Pokémon based on purchases
app.get('/PokemonRank', async (req, res) => {
    try {
        const pokemonRanking = await Purchases.aggregate([
            { $group: { _id: '$productId', totalSold: { $sum: '$quantity' } } },
            { $sort: { totalSold: -1 } }
        ]);
        res.status(200).json({ pokemonRanking });
    } catch (error) {
        console.error('Error fetching Pokémon ranking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get all Pokémon stuffed animals owned by a user
app.get('/UserPokemons', verifyToken, async (req, res) => {
    try {
        const myPokemons = await Purchases.find({ userId: req.userId }).populate('productId');
        res.status(200).json({ myPokemons });
    } catch (error) {
        console.error('Error fetching user Pokémons:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = app;