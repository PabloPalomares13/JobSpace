import express from 'express'
import { connectToDatabase } from '../lib/db.js';
import multer from 'multer'
import path from 'path'
import fs from 'fs';
import verifyToken from '../middleware/verifyToken.js';

const app = express.Router()


app.get('/profile',verifyToken, async (req, res) => {
    const userId = req.userId;  //  obtener el ID del usuario desde el token de sesión o JWT
    try {
        const db = await connectToDatabase();
        const [profileData] = await db.query(`
            SELECT * FROM perfil WHERE username_id = ?
        `, [userId]);

        if (profileData.length > 0) {
            res.json(profileData[0]); // Enviar datos existentes si ya existen
        } else {
            res.json({ message: "No profile data" }); // Indica que no hay datos
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching profile data" });
    }
});
app.post('/personal',verifyToken, async (req, res) => {
    const { firstName, lastName, email, phoneNumber, address, city, barrio, dob } = req.body;
    const userId = req.userId;

    try {
        const db = await connectToDatabase();
        console.log('Conexión a la base de datos establecida');

            await db.query(`
                INSERT INTO perfil (username_id, firstName, lastName, email, phoneNumber, address, city, barrio, dob)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [userId, firstName, lastName, email, phoneNumber, address, city, barrio, dob]);
            res.status(201).json({ message: "Perfil creado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error guardando perfil" });
        console.log(error)
    }
});

app.put('/personalact', async (req,res) => {
    const { firstName,lastName,email,phoneNumber, username, address, city, barrio,dob} = req.body;

    try {
        const db = await connectToDatabase();
        await db.query(`
            UPDATE perfil 
            SET firstName = ?, lastName = ?, phoneNumber = ?, address = ?, city = ?, barrio = ?, dob = ?
            WHERE username_id = (SELECT id FROM usuarios WHERE username = ?)
        `, [firstName, lastName, phoneNumber, address, city, barrio, dob, username]);

        await db.query(`
            UPDATE usuarios
            SET email = ?
            WHERE username = ?
        `, [email, username]);

        res.status(200).json({message: "Actualizacion Exitosa"});
    } catch (error) {
        console.error("Error en la actualización de perfil:", error); // para ver detalles en la consola
        res.status(500).json({ error: "Error al actualizar", details: error.message });
    }
    });

app.put('/user/profile/work', async (req,res) => {
    const { profesion,exp,refe,link} = req.body;

    try {
        const db = await connectToDatabase();
        await db.query(`
            UPDATE perfil
            SET profesion = ?, exp = ?, refe = ?, link = ?
            WHERE username_id = (SELECT id FROM usuarios WHERE username = ?)
        `,[profesion,exp,refe,link,req.body.username]);
        res.status(200).json({message: "Actualizacion work exitosa"});
    }
    catch (error){
        res.status(500).json({error: "Error al actualizar work", details: error})
    }
});
app.put('/user/profile/education', async (req, res) => {
    const { colegio, tituloPro, tituloTec } = req.body;

    try {
        const db = await connectToDatabase();
        await db.query(`
            UPDATE perfil 
            SET colegio = ?, tituloPro = ?, tituloTec = ?
            WHERE username_id = (SELECT id FROM usuarios WHERE username = ?)
        `, [colegio, tituloPro, tituloTec, req.body.username]);

        res.status(200).json({ message: "Actualizacion educacion exitosa" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar educacion", details: error });
    }
});
app.put('/user/profile/bio', async (req, res) => {
    const { bio } = req.body;

    try {
        const db = await connectToDatabase();
        await db.query(`
            UPDATE perfil 
            SET bio = ?
            WHERE username_id = (SELECT id FROM usuarios WHERE username = ?)
        `, [bio, req.body.username]);

        res.status(200).json({ message: "Actualizacion bio exitosa" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar bio", details: error });
    }
});


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('No es un archivo de imagen válido'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Ruta para subir la imagen de perfil
app.post('/user/upload', upload.single('profilePic'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se subió ningún archivo" });
    }

    try {
        const db = await connectToDatabase();
        
        // Comprobar si ya existe una imagen de perfil para este usuario
        const [existingImage] = await db.query(
            'SELECT pic_path FROM perfil WHERE username_id = (SELECT id FROM usuarios WHERE username = ?)',
            [req.body.username]
        );

        // Si existe una imagen anterior, eliminarla
        if (existingImage && existingImage.pic_path) {
            const oldPath = path.join('uploads/', existingImage.pic_path);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            // Actualizar la ruta de la imagen en la base de datos
            await db.query(
                `UPDATE perfil 
                 SET pic_path = ?
                 WHERE username_id = (SELECT id FROM usuarios WHERE username = ?)`,
                [req.file.filename, req.body.username]
            );

            res.json({ 
                message: "Imagen de perfil actualizada con éxito",
                filename: req.file.filename
            });
        } else {
            // Insertar la nueva imagen si no existe un registro previo
            await db.query(
                `INSERT INTO perfil (username_id, pic_path)
                 VALUES ((SELECT id FROM usuarios WHERE username = ?), ?)`,
                [req.body.username, req.file.filename]
            );

            res.json({ 
                message: "Imagen de perfil insertada con éxito",
                filename: req.file.filename
            });
        }

    } catch (error) {
        console.error('Error al manejar la imagen de perfil:', error);
        res.status(500).json({ error: "Error al manejar la imagen de perfil" });
    }
});

export default app;