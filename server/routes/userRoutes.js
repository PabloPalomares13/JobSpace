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
app.post('/personal', verifyToken, async (req, res) => {
    const { firstName, lastName, email, phoneNumber, address, city, barrio, dob } = req.body;
    const userId = req.userId;

    try {
        const db = await connectToDatabase();
        console.log('Conexión a la base de datos establecida');

        // Verificar si ya existe un perfil para este usuario
        const [existingProfile] = await db.query(
            'SELECT * FROM perfil WHERE username_id = ?',
            [userId]
        );

        if (existingProfile.length > 0) {
            // Si ya existe un perfil, realiza un UPDATE
            await db.query(`
                UPDATE perfil 
                SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, address = ?, city = ?, barrio = ?, dob = ?
                WHERE username_id = ?
            `, [firstName, lastName, email, phoneNumber, address, city, barrio, dob, userId]);

            res.status(200).json({ message: "Perfil actualizado con éxito" });
        } else {
            // Si no existe un perfil, realiza un INSERT
            await db.query(`
                INSERT INTO perfil (username_id, firstName, lastName, email, phoneNumber, address, city, barrio, dob)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [userId, firstName, lastName, email, phoneNumber, address, city, barrio, dob]);

            res.status(201).json({ message: "Perfil creado con éxito" });
        }
    } catch (error) {
        console.error("Error al guardar o actualizar el perfil:", error);
        res.status(500).json({ error: "Error guardando perfil" });
    }
});

app.post('/work', verifyToken, async (req, res) => {
    const { profesion, exp, refe, link } = req.body;
    const userId = req.userId;

    try {
        const db = await connectToDatabase();
        console.log('Conexión a la base de datos establecida');

        // Verificar si ya existe un registro de trabajo para este usuario
        const [existingWork] = await db.query(
            'SELECT * FROM perfil WHERE username_id = ?',
            [userId]
        );

        if (existingWork.length > 0) {
            // Si ya existe un registro, realiza un UPDATE
            await db.query(`
                UPDATE perfil 
                SET profesion = ?, exp = ?, refe = ?, link = ?
                WHERE username_id = ?
            `, [profesion, exp, refe, link, userId]);

            res.status(200).json({ message: "Información de trabajo actualizada con éxito" });
        } else {
            // Si no existe un registro, realiza un INSERT
            await db.query(`
                INSERT INTO perfil (username_id, profesion, exp, refe, link)
                VALUES (?, ?, ?, ?, ?)
            `, [userId, profesion, exp, refe, link]);

            res.status(201).json({ message: "Información de trabajo creada con éxito" });
        }
    } catch (error) {
        console.error("Error al guardar o actualizar la información de trabajo:", error);
        res.status(500).json({ error: "Error guardando información de trabajo" });
    }
});

app.post('/education', verifyToken, async (req, res) => {
    const { colegio, tituloPro, tituloTec } = req.body;
    const userId = req.userId;

    try {
        const db = await connectToDatabase();

        // Verificar si ya existe un registro de educación para este usuario
        const [existingEducation] = await db.query(
            'SELECT * FROM perfil WHERE username_id = ?',
            [userId]
        );

        if (existingEducation.length > 0) {
            // Si existe un registro, se realiza un UPDATE
            await db.query(`
                UPDATE perfil 
                SET colegio = ?, tituloPro = ?, tituloTec = ?
                WHERE username_id = ?
            `, [colegio, tituloPro, tituloTec, userId]);

            res.status(200).json({ message: "Educación actualizada con éxito" });
        } else {
            // Si no existe un registro, realiza un INSERT
            await db.query(`
                INSERT INTO perfil (username_id, colegio, tituloPro, tituloTec)
                VALUES (?, ?, ?, ?)
            `, [userId, colegio, tituloPro, tituloTec]);

            res.status(201).json({ message: "Educación creada con éxito" });
        }
    } catch (error) {
        console.error("Error al guardar o actualizar la información de educación:", error);
        res.status(500).json({ error: "Error al guardar la información de educación", details: error });
    }
});

app.post('/bio', verifyToken, async (req, res) => {
    const { bio } = req.body;
    const userId = req.userId;

    try {
        const db = await connectToDatabase();

        // Verificar si ya existe un perfil para este usuario
        const [existingProfile] = await db.query(
            'SELECT * FROM perfil WHERE username_id = ?',
            [userId]
        );

        if (existingProfile.length > 0) {
            // Si existe un registro, se realiza un UPDATE
            await db.query(`
                UPDATE perfil 
                SET bio = ?
                WHERE username_id = ?
            `, [bio, userId]);

            res.status(200).json({ message: "Biografía actualizada con éxito" });
        } else {
            // Si no existe un registro, realiza un INSERT
            await db.query(`
                INSERT INTO perfil (username_id, bio)
                VALUES (?, ?)
            `, [userId, bio]);

            res.status(201).json({ message: "Biografía creada con éxito" });
        }
    } catch (error) {
        console.error("Error al guardar o actualizar la biografía:", error);
        res.status(500).json({ error: "Error al guardar la biografía", details: error });
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
    // Aceptar solo imágenes
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


app.post('/upload', verifyToken, upload.single('profilePic'), async (req, res) => {

    const userId = req.userId;
    
    if (!req.file) {
        return res.status(400).json({ error: "No se subió ningún archivo" });
    }
    try {
        const db = await connectToDatabase();
        
        // Comprobar si ya existe una imagen de perfil para este usuario
        const [existingImage] = await db.query(
            'SELECT pic_path FROM perfil WHERE username_id = ?',
            [userId]
        );

        if (existingImage.length > 0) {
            // Si existe una imagen anterior, eliminarla del sistema de archivos
            await db.query(
                `UPDATE perfil 
                 SET pic_path = ?
                 WHERE username_id = ?`,
                [req.file.filename, userId]
            );
            res.json({ 
                message: "Imagen de perfil actualizada con éxito",
                filename: req.file.filename
            });
        } else {
            // Insertar la nueva imagen si no existe un registro previo
            await db.query(
                `INSERT INTO perfil (username_id, pic_path)
                VALUES (?, ?)`,
                [userId, req.file.filename]
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

app.get('/profile-image/:userId',verifyToken, async (req, res) => {

    const userId = req.userId;
  
    try {
      // Consulta para obtener el path de la imagen del perfil
      const query = 'SELECT pic_path FROM perfil WHERE username_id = ?';
      const db = await connectToDatabase();
      const [results] = await db.query(query, [userId]);
  
      if (results.length > 0) {
        const imagePath = results[0].pic_path;
  
        if (imagePath) {
          // Si hay una imagen, enviar la ruta de la imagen
          const imageFullPath = path.join(__dirname, 'upload', imagePath);
          res.sendFile(imageFullPath);
        } else {
          res.status(404).json({ error: 'Imagen no encontrada.' });
        }
      } else {
        res.status(404).json({ error: 'Usuario no encontrado.' });
      }
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      res.status(500).json({ error: 'Error al obtener la imagen del perfil.' });
    }
  });

app.post('/postjob', verifyToken, async (req, res) => {
    const { titulo, descripcion, salario, contacto } = req.body;
    const userId = req.userId;  // ID del usuario obtenido del token previamente validado

    try {
        // Obtén el perfil_usu_id del usuario
        const db = await connectToDatabase();


        const insertJobQuery = `
            INSERT INTO jobs (titulo, descripcion, salario, contacto, perfil_data)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [insertResult] = await db.query(insertJobQuery, [titulo, descripcion, salario, contacto, userId]);

        res.status(201).json({ message: 'Trabajo publicado con éxito.', jobId: insertResult.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el trabajo.' });
    } 
});

app.get('/findjobs', async (req, res) => {
    const db = await connectToDatabase();

    try {
        // Consulta para obtener todos los registros de la tabla `jobs`
        const query = `
            SELECT 
                jobs.titulo, 
                jobs.descripcion, 
                jobs.salario, 
                jobs.contacto, 
                jobs.fecha_publicacion,
                perfil.FirstName AS firstName,
                perfil.lastName AS lastName
            FROM 
                jobs
            JOIN 
                perfil
            ON 
                jobs.perfil_data = perfil.username_id
            ORDER BY 
                jobs.fecha_publicacion DESC;
        `;

        const [results] = await db.query(query);

        // Retornar los trabajos obtenidos
        res.status(200).json({
            message: 'Trabajos obtenidos exitosamente.',
            jobs: results,
        });
    } catch (error) {
        console.error('Error al obtener los trabajos:', error);
        res.status(500).json({ error: 'Error al obtener los trabajos.' });
    }
});

app.get('/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Debe proporcionar un término de búsqueda.' });
    }

    const searchQuery = `
        SELECT 
            jobs.titulo, 
            jobs.descripcion, 
            jobs.salario, 
            jobs.contacto, 
            jobs.fecha_publicacion,
            perfil.FirstName AS firstName,
            perfil.lastName AS lastName
        FROM 
            jobs
        JOIN 
            perfil
        ON 
            jobs.perfil_data = perfil.username_id
        WHERE 
            perfil.firstName LIKE ? OR perfil.lastName LIKE ? OR jobs.titulo LIKE ?
    `;
    const searchTerm = `%${req.query.query}%`; 
    const db = await connectToDatabase();
    try {
        const [results] = await db.query(searchQuery, [searchTerm , searchTerm, searchTerm ]);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error al buscar trabajos:', error);
        res.status(500).json({ message: 'Error al realizar la búsqueda', error: error.message });
    }
});
export default app;