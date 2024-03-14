//PORT = 8080;

const express = require("express"); //importando el modulo de express
const app = express(); //generando la instancia del modulo
const http = require("http").createServer(app);
require('dotenv').config();

const PORT = process.env.PORT; //|| 8050;


app.get("/", (req,res) =>{
res.send("Todos putos2")
})
app.post("/", (req,res) =>{
    res.send("Todos_putos.post")
    })
http.listen(PORT, () => {
    console.log(`buenas, server corriendo en el port ${PORT}`);
 
});



