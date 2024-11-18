import { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import logo from '../../assets/LogoB.png';
import axios from "axios";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [userProfilePic, setUserProfilePic] = useState(""); // Foto de perfil del usuario
  const [showDropdown, setShowDropdown] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();
  const toggleMenu = () => setIsOpen(!isOpen);

  // Simular la autenticación del usuario al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Aquí puedes llamar a tu API para obtener datos del usuario
      axios
        .get("http://localhost:3000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setUserProfilePic(response.data.profilePicPath); // Asumiendo que recibes el path de la foto
        })
        .catch(() => setIsAuthenticated(false));
    }
  }, []);
  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/user/profile', {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    fetchUserProfile();
}, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Alternar visibilidad del menú
  };

  const handleScroll = (id) => {
    if (location.pathname !== "/home") {
      // Cambiar a la página principal y almacenar el destino
      navigate(`/?section=${id}`);
    } else {
      // Desplazarse directamente si ya estás en la página principal
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionId = params.get("section");
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <header className="fixed backdrop-blur-lg flex flex-col shadow-md py-4 px-4 sm:px-10 font-sans min-h-[70px] tracking-wide left-0 right-0 z-50">
      <div className="flex items-center justify-between gap-5 w-full ">
        <a href="#">
          <img
            src={logo}
            alt="logo"
            className="w-52 bg-white rounded-2xl px-1 py-1 bg-opacity-80"
          />
        </a>
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:justify-center absolute md:static w-11/12 md:w-auto bg-white top-full mt-2 md:mt-0 shadow-lg md:shadow-none z-40 px-5 py-5 bg-opacity-95 rounded-2xl`}
        >
          <ul className="flex flex-col md:flex-row items-center gap-5 text-center p-4 md:p-0 w-[90%] sm:w-[80%] md:w-auto mx-auto">
            <li>
            <button onClick={() => handleScroll("inicio")} className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">
              Inicio
            </button>
            </li>
            <li>
            <button onClick={() => handleScroll("caracteristicas")} className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">
            Caracteristicas
            </button>
            </li>
            <li>
            <button onClick={() => handleScroll("testimonios")} className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">
            Testimonios
            </button>
            </li>
            <li>
            <button onClick={() => handleScroll("ventajas")} className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">
            Ventajas
            </button>
            </li>
            <li>
            <button onClick={() => handleScroll("contacto")} className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">
            Contacto
            </button>
            </li>
          </ul>
        </div>
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div  className="relative">
              <button
                onClick={toggleDropdown}
                className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none xl:ml-48 lg:ml-42"
              >
              {/* Foto de perfil */}
              <img
                src={`http://localhost:3000/upload/${userProfilePic}`}
                alt="Profile"
                className="w-16 h-16 rounded-full cursor-pointer "
              />
              </button>
              {showDropdown && ( 
              <ul className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg rounded-lg p-2 z-50">
                <li>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowDropdown(false); 
                    }}
                    
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Mi Perfil
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/offers");
                      setShowDropdown(false); // Cierra el menú
                    }}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Ofertas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false); // Cierra el menú
                    }}
                    className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
              )}
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="md:w-full px-4 py-2.5 text-sm rounded-2xl font-bold text-white border-2 border-[#3b92a3] bg-[#3b92a3] transition duration-300 hover:bg-transparent hover:text-[#344a4e]"
              >
                Iniciar sesión
              </a>
              <a
                href="/register"
                className="px-4 py-2.5 text-sm rounded-2xl font-bold text-white border-2 border-[#a1c4d4] bg-[#a1c4d4] transition duration-300 hover:bg-transparent hover:text-[#adccd2]"
              >
                Registrarse
              </a>
            </>
          )}
          {/* Botón de menú */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none transition-transform duration-180"
          >
            {isOpen ? (
              <svg
                className="w-7 h-7 fill-current text-black transition duration-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <line
                  x1="4"
                  y1="4"
                  x2="20"
                  y2="20"
                  stroke="black"
                  strokeWidth="2"
                />
                <line
                  x1="4"
                  y1="20"
                  x2="20"
                  y2="4"
                  stroke="black"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg
                className="w-7 h-7 fill-current text-black transition duration-180"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}


// import { useState } from 'react';
// import logo from '../../assets/LogoB.png';
// export default function Header() {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   return (
//     <header className="fixed backdrop-blur-lg flex flex-col shadow-md py-4 px-4 sm:px-10 font-sans min-h-[70px] tracking-wide left-0 right-0 z-50" >
//       <div className="flex items-center justify-between gap-5 w-full ">
//         <a href="#"><img src={logo} alt="logo" className="w-52 bg-white rounded-2xl px-1 py-1 bg-opacity-80" /></a>
//         <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:justify-center absolute md:static w-11/12 md:w-auto bg-white top-full mt-2 md:mt-0 shadow-lg md:shadow-none z-40 px-5 py-5 bg-opacity-95 rounded-2xl`}>
//         <ul className="flex flex-col md:flex-row items-center gap-5 text-center p-4 md:p-0 w-[90%] sm:w-[80%] md:w-auto mx-auto">
//             <li><a href="/home" className="hover:text-[#57a5b5] text-[#57a5b5] font-semibold text-[15px]">Home</a></li>
//             <li><a href="/contact" className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">Team</a></li>
//             <li><a href="#" className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">Feature</a></li>
//             <li><a href="#" className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">Blog</a></li>
//             <li><a href="#" className="hover:text-[#57a5b5] text-gray-500 font-semibold text-[15px]">About</a></li>
//           </ul>
//         </div>
//       <div className="flex items-center space-x-3">
//         <div className=""></div>
//           <a href="/login" className="md:w-full px-4 py-2.5 text-sm rounded-2xl font-bold text-white border-2 border-[#3b92a3] bg-[#3b92a3] transition duration-300 hover:bg-transparent hover:text-[#344a4e]">Iniciar sesion</a>
//           <a href="/register" className="px-4 py-2.5 text-sm rounded-2xl font-bold text-white border-2 border-[#a1c4d4] bg-[#a1c4d4] transition duration-300 hover:bg-transparent hover:text-[##adccd2]">Registrarse</a>
          
//           {/* Botón de menú con transición de cambio de ícono */}
//           <button onClick={toggleMenu} className="md:hidden focus:outline-none transition-transform duration-180">
//             {isOpen ? (
//               // Icono X para cerrar (simplificado)
//               <svg className="w-7 h-7 fill-current text-black transition duration-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                 <line x1="4" y1="4" x2="20" y2="20" stroke="black" strokeWidth="2" />
//                 <line x1="4" y1="20" x2="20" y2="4" stroke="black" strokeWidth="2" />
//               </svg>
//             ) : (
//               // Icono de menú hamburguesa
//               <svg className="w-7 h-7 fill-current text-black transition duration-180" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                 <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>    
//     </header>
//   );
// }