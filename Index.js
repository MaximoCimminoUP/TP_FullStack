//PORT = 8080;

const express = require("express"); //importando el modulo de express
const app = express(); //generando la instancia del modulo
const http = require("http").createServer(app);
require('dotenv').config();

const PORT = process.env.PORT; //|| 8050;



app.get("/categorias", (req,res) =>{
res.send("x");
})
app.get("/remeras",(req,res) => {
    let resultado = {'Garfield:':{'precio':15200, 'talles': 's-XL', 'categoria': 'personajes' },
                    'Snoopy': {'precio':14500, 'talles': 'XS - L', 'categoria':'personajes'
                    }}
                    res.json({'remeras':resultado})//retorna al frontend el json con la respuesta
})
app.post("/remeras", (req,res) =>{
    let datos = req.body
    console.log(req.params)
    res.send("Llamada post.")
    })

    http.listen(PORT, () => {
    console.log(`buenas, server corriendo en el port ${PORT}`);
 
});



