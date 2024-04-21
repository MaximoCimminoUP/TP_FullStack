const express = require("express");
const app = express();
const http = require("http").createServer(app);
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const runDB = require('./dbConnection.js')

const PORT = process.env.PORT || 8050;
const URI = process.env.URI;

const userRoutes = require('./backEnd/estructura_proyecto/routes/userRoutesProfile.js');

//Landing page route 
app.get("/", (req, res) => {
    res.send("Welcome to the login screen"); 
});

app.get("/home", (req, res) => {
    res.send("Hola");
});
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Calls the addUser function with provided data
        await addUser(name, email, password);
        res.status(200).json({ message: 'User added successfully' });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post("/register", (req, res) => {
    res.send("Hola todos");
});

http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // finds user using username
    const user = users.find(user => user.username === username);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    //verifies password
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error interno del servidor' });
        if (!result) return res.status(401).json({ error: 'Contraseña incorrecta' });

        //Generates JWT token
        const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    });
});


app.use('/user', userRoutes);

runDB();
