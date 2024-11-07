import { useState } from 'react';
import logo from '../../assets/LogoB.png';
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed backdrop-blur-lg flex flex-col shadow-md py-4 px-4 sm:px-10 font-sans min-h-[70px] tracking-wide left-0 right-0 z-50" >
      <div className="flex items-center justify-between gap-5 w-full ">
        <a href="#"><img src={logo} alt="logo" className="w-52 bg-white rounded-2xl px-1 py-1 bg-opacity-80" /></a>
        <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:justify-center absolute md:static w-11/12 md:w-auto bg-white top-full mt-2 md:mt-0 shadow-lg md:shadow-none z-40 px-5 py-5 bg-opacity-95 rounded-2xl`}>
        <ul className="flex flex-col md:flex-row items-center gap-5 text-center p-4 md:p-0 w-[90%] sm:w-[80%] md:w-auto mx-auto">
            <li><a href="/home" className="hover:text-[#57a5b5] text-[#57a5b5] font-semibold text-[15px]">Home</a></li>
            <li><a href="/contact" className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">Team</a></li>
            <li><a href="#" className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">Feature</a></li>
            <li><a href="#" className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">Blog</a></li>
            <li><a href="#" className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">About</a></li>
          </ul>
        </div>
      <div className="flex items-center space-x-3">
        <div className=""></div>
          <a href="/login" className="md:w-full px-4 py-2.5 text-sm rounded-2xl font-bold text-white border-2 border-[#3b92a3] bg-[#3b92a3] transition duration-300 hover:bg-transparent hover:text-[#344a4e]">Iniciar sesion</a>
          <a href="/register" className="px-4 py-2.5 text-sm rounded-2xl font-bold text-white border-2 border-[#a1c4d4] bg-[#a1c4d4] transition duration-300 hover:bg-transparent hover:text-[##adccd2]">Registrarse</a>
          
          {/* Botón de menú con transición de cambio de ícono */}
          <button onClick={toggleMenu} className="md:hidden focus:outline-none transition-transform duration-180">
            {isOpen ? (
              // Icono X para cerrar (simplificado)
              <svg className="w-7 h-7 fill-current text-black transition duration-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <line x1="4" y1="4" x2="20" y2="20" stroke="black" strokeWidth="2" />
                <line x1="4" y1="20" x2="20" y2="4" stroke="black" strokeWidth="2" />
              </svg>
            ) : (
              // Icono de menú hamburguesa
              <svg className="w-7 h-7 fill-current text-black transition duration-180" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            )}
          </button>
        </div>
      </div>    
    </header>
  );
}