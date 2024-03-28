//PORT = 8080;

const express = require("express"); //importando el modulo de express
const app = express(); //generando la instancia del modulo
const http = require("http").createServer(app);
require('dotenv').config();
const PORT = process.env.PORT; //|| 8050;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://cimminomaximo1:PVsujzr1VRRixMF9@cluster0.bwqyzg4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
//pasar uri al .env cuando este en casa


/****** *
const UsrController;
const ...Controller;
*/
app.get("/home", (req,res) =>{
res.send("Hola")
})
app.get("/Categorias", (req,res) =>{
    let resultado = 
    })
app.post("/", (req,res) =>{
    res.send("Hola todos")
    })
http.listen(PORT, () => {
    console.log(`buenas, server corriendo en el port ${PORT}`);
 
});



const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



