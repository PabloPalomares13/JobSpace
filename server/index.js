const express = require('express');
const { obtenerDatos } = require('./controllers');
const app = express();

app.use(express.json());

app.get('/api/datos',obtenerDatos);

const PORT = 3000;

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})