import express, { json } from 'express'
import { connectToDatabase } from '../lib/db.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import verifyToken from '../middleware/verifyToken.js';


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


export default router;

