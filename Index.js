const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http").createServer(app);
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const {login} = require('./backEnd/estructura_proyecto/controllers/auth.js');
const { addStuffedAnimal, getAllStuffedAnimals, getStuffedAnimalById, editStuffedAnimal, deleteStuffedAnimal } = require("./backEnd/estructura_proyecto/controllers/stuffedAnimal");
const StuffedAnimal = require('./backEnd/estructura_proyecto/models/stuffedAnimal.js');
const verifyToken = require('./backEnd/estructura_proyecto/middleware/auth-middleware.js');
const PORT = process.env.PORT || 8050;
const URI = process.env.URI;

app.use(express.json());

const userRoutes = require('./backEnd/estructura_proyecto/routes/userRoutesProfile.js');
const { addUser }  = require('./backEnd/estructura_proyecto/controllers/user');



// Create a MongoClient with a MongoClientOptions object to set the Stable API version

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
        if (result) {
            res.status(200).json({ message: 'User added successfully', user: result });
        } else {
            res.status(400).json({ error: 'User already exists' });
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
    
    const { email, password } = req.body;

    try {
        // Attempt to log in the user
        const token = await login(email, password);

        if (token) {
            // Login successful, send JWT token in response
            res.status(200).json({ token });
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


//adds new products
app.post('/stock', async (req, res) => {
    try{
        const { id, species, model, coloursAvailable, stock} = req.body;
        const result = await addStuffedAnimal(id, species, model, coloursAvailable, stock);
        console.log("no me mori ");
        if (result) {
            res.status(200).json({ message: 'Stuffed Animal added successfully'});
            console.log("no me mori 1 ");
        } else {
            res.status(400).json({ error: 'Stuffed Animal already exists' });
            console.log("no me mori 2 ");
        }
    } catch (error) {
        console.error('Error adding stock:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//shows all available products
app.get('/shop', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const stuffedAnimals = await getAllStuffedAnimals(limit, offset);
        res.status(200).json(stuffedAnimals);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to find the plush by id
app.get('/stuffedAnimals/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const stuffedAnimal = await getStuffedAnimalById(id);
        if (!stuffedAnimal) {
            return res.status(404).json({ error: 'Stuffed animal not found' });
        }
        return res.status(200).json(stuffedAnimal);
    } catch (error) {
        console.error('Error getting stuffed animal by ID:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to edit the plush with id
app.put('/stuffedAnimals/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const updatedStuffedAnimal = req.body;
    updatedStuffedAnimal._id = id; // Make sure the _id matches the ID in the URL
    try {
        const result = await editStuffedAnimal(updatedStuffedAnimal);
        res.status(200).json({ message: 'Stuffed animal updated successfully', stuffedAnimal: result });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to delete a plush
app.delete('/stuffedAnimals/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const result = await deleteStuffedAnimal(id);
        res.status(200).json({ message: 'Stuffed animal deleted successfully', stuffedAnimal: result });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/StuffedAnimalRank', async (req, res) => {
    try {
        const plushieRanking = await Sales.aggregate([
            { $group: { _id: '$productId', totalSold: { $sum: '$quantity' } } },
            { $sort: { totalSold: -1 } }
        ]);
        res.status(200).json({ plushieRanking });
    } catch (error) {
        console.error('Error fetching plushie ranking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/UserStuffedAnimals', verifyToken, async (req, res) => {
    try {
        const myPlushies = await StuffedAnimal.find({ userId: req.userId });
        res.status(200).json({ myPlushies });
    } catch (error) {
        console.error('Error fetching my plushies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.use('/user', userRoutes);

