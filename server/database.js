const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "jobspacedb"
});

connection.connect((error) => {
    if (error) throw error;
    console.log("Conectado a la base de datos Mysql.");
});

module.exports = connection;