import express from 'express'
import authRouter from './routes/authRoutes.js'
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'
import cors from 'cors';

const app = express()

dotenv.config();

app.use(cors());

app.use(express.json())

app.use(express.static('uploads')); 

app.use('/auth', authRouter)

app.use('/user', userRoutes);



app.listen(process.env.PORT, () =>{
    console.log("Servidor Funcionando correctamente", process.env.PORT)
})