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
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const path = require("path");
app.use(express.json()); 
const { addUser } = require('./backEnd/estructura_proyecto/controllers/user');
const cors = require('cors');
const Cart = require('./backEnd/estructura_proyecto/models/cart.js');
const Users= require('./backEnd/estructura_proyecto/models/user.js');
app.use(cors());
const userRoutes = require('./backEnd/estructura_proyecto/routes/userRoutesProfile.js');
const {getMostPopular} = require('./backEnd/estructura_proyecto/controllers/ranking.js')
const {newCart} = require('../TP_FullStack/backEnd/estructura_proyecto/controllers/cart.js');
/* app.use(express.static(path.join(__dirname, '..', 'public')));
 Create a MongoClient with a MongoClientOptions object to set the Stable API version*/
app.use('/api', userRoutes);

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
    console.log(req.body);
    let user = null;
    try {
        const { email, name, lastname, isActive = true , roles= [user], password } = req.body;
       console.log(email, )
        const result = await addUser(email, name, lastname, isActive, roles, password);
        user = result;
        console.log(result)
        if (result) {
            res.status(200).json({ message: 'User added successfully', user: result });
        } else {
            res.status(400).json({ error: 'User already exists' });
        }

        let cart = await Cart.findOne({ userId: user._id });
        console.log('Looking for cart with userId:', user._id);
         console.log('Found cart with userId:', cart ? cart.userId : 'None');
        
        if (!cart) {
            newCart(userId);
            console.log('New cart saved:', cart);
        }

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.post('/login', async (req, res) => {
    try {
        const loginResult = await login(req);

        if (loginResult) {
            // Set header here instead of in the login function
            res.setHeader('Authorization', 'Bearer '+ loginResult.token);
            console.log(loginResult.token);

            let cart = await Cart.findOne({ userId: loginResult.userId });

            // If user doesn't have a cart, create a new one
            if (!cart) {
                cart = new Cart({
                    userId: loginResult.userId,
                    items: []
                });
                await cart.save();
            }

            // Send token and cart info in one response
            res.status(200).json({  email: loginResult.email , token: loginResult.token, cartId: cart._id });
        } else {
            // If login fails, send an error response
            res.status(401).json({ error: 'Authentication failed.' });
        }
    } catch (error) {
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
            isShiny,
            accessories,
            stock,
            isBaseEvolution
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
    let limit = req.query.limit;
    let offset = req.query.offset;
    try {

        const pokemons = await getAllPokemons(limit, offset)
        res.status(200).json(pokemons)
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Endpoint to show Pokémon stuffed animals by ID
app.get('/pokemon/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const pokemon = await Pokemon.findOne({name: name});
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
app.put('/pokemon/:name', async (req, res) => {
    const id = req.params.id;
    const updatedPokemon = req.body;
    try {
        const result = await Pokemon.findOne({name}, updatedPokemon, { new: true });
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
        const pokemonRanking = getMostPopular();
        res.status(200).json({ pokemonRanking });
    } catch (error) {
        console.error('Error fetching Pokémon ranking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = app;