const connection = require('./database');

const obtenerDatos = (req, res) => {

    const query = "SELECT * FROM Usuario";
    
    connection.query(query,(error,results) => {
        if(error) return res.status(500).json({ error: "Error en la consulta"});

        res.json(results);
    });
};

module.exports = {obtenerDatos};