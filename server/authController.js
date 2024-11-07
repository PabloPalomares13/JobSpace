const connection = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const SECRET_KEY = 'JOBSPACE321';


const register = async (req,res) => {
    const { nombre,email,password } = req.body;

    const userCheckQuery =`SELECT JSON_OBJECT('id',id,'nombre',nombre,'email',email) AS usuario_json FROM usuarios WHERE email = ?`;
    connection.query(userCheckQuery, [email], async (error,results)=> {
        if (error) return res.status(500).json({ message: "Error en la consulta"});
        if(results.length > 0) return res.status(400).json({message: "El usuario ya esta registrado"});

        const hashedPassword = await bcrypt.hash(password,10);


        const registerQuery = `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`;
        connection.query(registerQuery,[nombre,email,hashedPassword],(error,result)=>{
            if(error) return res.status(500).json({message: "Error al registrar usuario"});
            res.status(201).json({message: "Uusuario registrado correctamente" , usuario: {id: result.insertId,nombre,email}
            });
        });
    });
};

const login = async (req,res) => {
    const { email, password } = req.body;

    const query = `SELECT JSON_OBJECT('id', id, 'nombre', nombre, 'email', email, 'password', password) AS usuario_json FROM usuarios WHERE email = ?`;
    connection.query(query, [email], async (error,results) => {
        if (error) return res.status(500).json({ message : "Error en la consulta"});
        if (results.length === 0 ) return res.status(404).json({ messsage: "Usuario no encontrado"});

        const usuario = JSON.parse(results[0].usuario_json);

        const isMatch = await bcrypt.compare(password,usuario.password);
        if (!isMatch) return res.status(400).json({message: "Contraseña incorrecta"});

        const token = jwt.sign({ id: usuario.id,email: usuario.email}, SECRET_KEY,{ expiresIn: '1h'});
        res.json({ message: "Login exitoso", token, usuario: { id:usuario.id,nombre: usuario.nombre,email:usuario.email } });

    })
}