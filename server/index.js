import express from 'express'
import authRouter from './routes/authRoutes.js'
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'
import cors from 'cors';
import jobRoutes from './routes/jobRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

dotenv.config();

app.use(cors());

app.use(express.json())

app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use('/auth', authRouter)

app.use('/user', userRoutes);

app.listen(process.env.PORT, () =>{
    console.log("Servidor Funcionando correctamente", process.env.PORT)
})