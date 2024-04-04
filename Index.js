const express = require("express");
const app = express();
const http = require("http").createServer(app);
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const PORT = process.env.PORT || 8050;
const URI = process.env.URI;

app.get("/", (req, res) => {
    res.send("Welcome to the login screen"); // Placeholder message
});

app.get("/home", (req, res) => {
    res.send("Hola");
});

app.get("/Categorias", (req, res) => {
    
    res.send("Categorias endpoint");
});

app.post("/try1", (req, res) => {
    res.send("Hola todos");
});

http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const client = new MongoClient(URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToMongoDB() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToMongoDB();

// Optional: Handle process termination to close MongoDB connection
process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});