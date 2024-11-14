import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const handleChanges = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3000/auth/login', values)
            if(response.status === 201) {
                localStorage.setItem('token', response.data.token)
                navigate('/profile')
            }
        } catch(err) {
            console.log(err.message)
            alert("Usuario no encontrado, contraseña o email incorrectos");
        }
    }
    return (
        <div className="h-screen md:flex">
        <div className="relative overflow-hidden md:flex w-1/2 i justify-around items-center hidden" style={{ background: 'linear-gradient(180deg, rgba(35,100,115,1) 0%, rgba(87,165,181,1) 50%, rgba(173,204,210,1) 100%)' }}>
            <div>
                <h1 className="text-white font-bold text-4xl font-sans">JobSpace</h1>
                <p className="text-white mt-3 mb-8">La plataforma mas popular entre los trabajadores independientes</p>
                <a href="/register" className="cursor-pointer transition-all bg-[#3b92a3] text-white px-6 py-2 rounded-lg border-[#236473] border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                    active:border-b-[2px] active:brightness-90 active:translate-y-[2px] ">Registrarse</a>
                    <a href="/home" className="cursor-pointer transition-all bg-[#236473] text-white px-6 py-2 rounded-lg border-[#3b92a3] border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                    active:border-b-[2px] active:brightness-90 active:translate-y-[2px] ml-3">Home</a>
            </div>
            <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
            <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
            <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
            <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        </div>
        <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
            <form className="bg-white" onSubmit={handleSubmit}>
                <h1 className="text-gray-800 font-bold text-2xl mb-1">Hola  !</h1>
                <p className="text-sm font-normal text-gray-600 mb-7">Bienvenido de nuevo</p>
                        <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            <input className="pl-2 outline-none border-none" type="email" name="email" placeholder="Correo" onChange={handleChanges}/>
                        </div>
                        <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd" />
                                </svg>
                                <input className="pl-2 outline-none border-none" type="password" name="password" placeholder="Contraseña" onChange={handleChanges} />
                </div>
                                <button type="submit" class="block w-full border-[#3b92a3] bg-[#3b92a3] mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Iniciar sesión</button>
                                <span className="text-sm ml-2 hover:text-blue-500 cursor-pointer">¿Olvidaste la contraseña?</span>
                                
            </form>
        </div>
    </div>
    )
}

export default Login