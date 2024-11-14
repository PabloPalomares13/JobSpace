import express, { json } from 'express'
import { connectToDatabase } from '../lib/db.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import verifyToken from '../middleware/verifyToken.js';
import multer from 'multer'
import path from 'path'

const router = express.Router()

router.post('/register', async (req,res) => {
    const {username,email,password} = req.body;
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email])
        if(rows.length > 0){
            return res.status(409).json({message: "user already existed"})
        }

        const hashPassword = await bcrypt.hash(password,10)
        await db.query("INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)",
            [username,email,hashPassword])

        res.status(201).json({message: "user created successfully"})
    } catch (err) {
        res.status(500).json(err)
    }
})

router.post('/login', async (req,res) => {
    const {email,password} = req.body;
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email])
        if(rows.length === 0){
            return res.status(404).json({message: "User no found"})
        }
        const isMatch = await bcrypt.compare(password, rows[0].password)
        if(!isMatch){
            return res.status(401).json({message: "Wrong password"})
        }
        const token = jwt.sign({id: rows[0].id}, process.env.JWT_KEY, {expiresIn: '3h'})

        res.status(201).json({token: token})
    } catch (err) {
        res.status(500).json(err)
    }
})



router.get('/profile', verifyToken, async (req,res)=>{
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [req.userId])
        if(rows.length === 0){
            return res.status(404).json({message: "User no found"})
        }   

        return res.status(201).json({user: rows[0]})
    } catch (error) {
        return res.status(500).json({message:"server error"}) 
    }
});


// router.put('/profile/personal', async (req,res) => {
//     const { firstName,lastName,email,phoneNumber, username, address, city, barrio,dob} = req.body;

//     try {
//         const db = await connectToDatabase();
//         await db.query(`
//             UPDATE perfil 
//             SET firstName = ?, lastName = ?, phoneNumber = ?, address = ?, city = ?, barrio = ?, dob = ?
//             WHERE username_id = (SELECT id FROM usuarios WHERE username = ?)
//         `, [firstName,lastName,email,phoneNumber, username, address, city, barrio,dob]);

//         await db.query(`
//             UPDATE Usuarios
//             SET email = ?,
//             WHERE username = ?
//         `)

//         res.status(200).json({message: "Actualizacion Exitosa"});
//     } catch (error) {
//         res.status(500).json({error: "Error al actualizar", details: error })
        
//     }
// });

// router.put('/user/profile/work', async (req,res) => {
//     const { profesion,exp,refe,link} = req.body;

//     try {
//         const db = await connectToDatabase();
//         await db.query(`
//             UPDATE perfil
//             SET profesion = ?, exp = ?, refe = ?, link = ?
//             WHERE username_id = (SELECT id FROM usuarios WHERE username = ?)
//         `,[profesion,exp,refe,link,req.body.username]);
//         res.status(200).json({message: "Actualizacion work exitosa"});
//     }
//     catch (error){
//         res.status(500).json({error: "Error al actualizar work", details: error})
//     }
// });
// router.put('/user/profile/education', async (req, res) => {
//     const { colegio, tituloPro, tituloTec } = req.body;

//     try {
//         const db = await connectToDatabase();
//         await db.query(`
//             UPDATE perfil 
//             SET colegio = ?, tituloPro = ?, tituloTec = ?
//             WHERE username_id = (SELECT id FROM usuarios WHERE username = ?)
//         `, [colegio, tituloPro, tituloTec, req.body.username]);

//         res.status(200).json({ message: "Actualizacion educacion exitosa" });
//     } catch (error) {
//         res.status(500).json({ error: "Error al actualizar educacion", details: error });
//     }
// });
// router.put('/user/profile/bio', async (req, res) => {
//     const { bio } = req.body;

//     try {
//         const db = await connectToDatabase();
//         await db.query(`
//             UPDATE perfil 
//             SET bio = ?
//             WHERE username_id = (SELECT id FROM usuarios WHERE username = ?)
//         `, [bio, req.body.username]);

//         res.status(200).json({ message: "Actualizacion bio exitosa" });
//     } catch (error) {
//         res.status(500).json({ error: "Error al actualizar bio", details: error });
//     }
// });
// const upload = multer({ dest: 'uploads/' });

// router.post('/user/upload-cv', upload.single('cvFile'), async (req, res) => {
//     const filePath = req.file.path; // Ruta donde se guarda el archivo temporalmente

//     try {
//         const db = await connectToDatabase();
//         await db.query(`
//             UPDATE perfil 
//             SET cv_path = ?
//             WHERE username_id = (SELECT id FROM usuarios WHERE username = ?)
//         `, [filePath, req.body.username]);

//         res.status(200).json({ message: "CV uploaded successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Error uploading CV", details: error });
//     }
// });
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         if (file.fieldname === 'profilePic') {
//             cb(null, 'uploads/profile_pics');
//         } else if (file.fieldname === 'cvFile') {
//             cb(null, 'uploads/cvs');
//         }
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         cb(null, req.body.username + ext); // Usa el username para facilitar la identificación
//     }
// });
// const uploadimg = multer({ storage });

export default router;

