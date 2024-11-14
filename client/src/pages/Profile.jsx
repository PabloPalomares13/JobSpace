import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
const Profile = () => {

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: { "authorization": `Bearer ${token}` }
            };

            const response = await axios.get('http://localhost:3000/auth/profile', config);

            if (response.status !== 201) {
                navigate('/login');
            } else {
                setUserData(response.data);  // Configuración inicial de datos de usuario si el perfil es válido
            }
        } catch (err) {
            console.log("Error en la autenticación del usuario:", err);
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchUser();
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
        
        useEffect(() => {
            axios.get('http://localhost:3000/api/user/profile', {
                headers: {
                    "authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                if (response.data.message !== "No profile data") {
                    setUserData(response.data);
                }
            })
            .catch(error => console.error("Error fetching user profile:", error));
        }, []);
        
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
        bio: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        username: '',
        address: '',
        city: '',
        barrio: '',
        dob: '',
        profesion: '',
        exp: '',
        refe: '',
        link: '',
        colegio: '',
        tituloPro: '',
        tituloTec: '',
        pic_path: ''
    });

    const [profilePic, setProfilePic] = useState(null);

    const submitPersonalInfo = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };

        try {
            const response = await axios.post('http://localhost:3000/user/personal', {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                username: userData.username,
                address: userData.address,
                city: userData.city,
                barrio: userData.barrio,
                dob: userData.dob
            }, config);

            if (response.status === 200) {
                alert("Información personal actualizada con éxito");
            }
        } catch (error) {
            console.error("Error al actualizar información personal:", error);
            alert("Error al actualizar la información personal");
        }
    };

    const loadUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/profile');
            if (response.data && response.data !== "No profile data") {
                setUserData(response.data);
            }
        } catch (error) {
            console.error("Error al cargar los datos del usuario:", error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Verificar el tipo de archivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor, seleccione un archivo de imagen válido');
                return;
            }
            // Verificar el tamaño (por ejemplo, máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen es demasiado grande. El tamaño máximo es 5MB');
                return;
            }
            setProfilePic(file);
        }
    };

    const handleProfilePicSubmit = async () => {
        if (!profilePic) {
            alert("Por favor, seleccione una imagen primero");
            return;
        }

        const formData = new FormData();
        formData.append("profilePic", profilePic);

        try {
            const response = await axios.post('http://localhost:3000/user/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert("Imagen de perfil actualizada exitosamente");
            }
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            alert("Error al actualizar la imagen de perfil");
        }
    };

    

    const submitWorkInfo = async () => {
        try {
            const response = await axios.put('http://localhost:3000/user/profile/work', {
                profesion: userData.profesion,
                exp: userData.exp,
                refe: userData.refe,
                link: userData.link,
                username: userData.username
            });
            
            if (response.status === 200) {
                alert("Información laboral actualizada con éxito");
            }
        } catch (error) {
            console.error("Error al actualizar información laboral:", error);
            alert("Error al actualizar la información laboral");
        }
    };

    const submitSchoolInfo = async () => {
        try {
            const response = await axios.put('http://localhost:3000/user/profile/education', {
                colegio: userData.colegio,
                tituloPro: userData.tituloPro,
                tituloTec: userData.tituloTec,
                username: userData.username
            });
            
            if (response.status === 200) {
                alert("Información educativa actualizada con éxito");
            }
        } catch (error) {
            console.error("Error al actualizar información educativa:", error);
            alert("Error al actualizar la información educativa");
        }
    };
    const submitBio = async () => {
                try {
                    await axios.put('user/profile/bio', {
                        bio: userData.bio,
                    });
                    alert("Biografia actualizada con éxito.");
                } catch (error) {
                    console.error("Error actualizando biografia: ", error);
                    alert("Error al actualizar biografia.");
                }
            };
        
            useEffect(() => {
                loadUserData();  // Cargar datos del usuario cuando el componente se monta
            }, []);
        
//     const fetchUser = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       const response = await axios.get('http://localhost:3000/auth/profile', {
//         headers: {
//           "authorization" : `Bearer ${token}`
//         }
//       })
//       if(response.status !== 201) {
//         navigate('/login')
//       }
//       navigate('/profile')
//     } catch(err){
//       navigate('/login')
//       console.log(err)
//     }
//   }

//   useEffect(() => {
//     fetchUser()
//   }, [])
    



//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             try {
//                 const response = await axios.get('user/profile');
//                 setUserData(response.data);
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             }
//         };
//         fetchUserProfile();
//     }, []);
    
//     useEffect(() => {
//         axios.get('/api/user/profile')
//             .then(response => {
//                 if (response.data.message !== "No profile data") {
//                     setUserData(response.data);
//                 }
//             })
//             .catch(error => console.error("Error fetching user profile:", error));
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUserData(prevData => ({ ...prevData, [name]: value }));
//     };

//     const loadUserData = async () => {
//         try {
//             const response = await axios.get('http://localhost:3000/user/profile');
//             setUserData(response.data);  // Asigna los datos a tu estado
//         } catch (error) {
//             console.error("Error al cargar los datos del usuario:", error);
//             // Mostrar un mensaje si no hay datos
//         }
//     };    

//     const handleProfilePicSubmit = async () => {
//         if (!profilePic) return alert("No se ha seleccionado una imagen de perfil.");
    
//         const formData = new FormData();
//         formData.append("profilePic", profilePic);
    
//         try {
//             await axios.post('user/upload-profile-pic', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             alert("Imagen de perfil enviada exitosamente.");
//         } catch (error) {
//             console.error("Error al enviar la imagen de perfil:", error);
//             alert("Error al enviar la imagen de perfil.");
//         }
//     };


//     const handleCvChange = (e) => {
//         setCvFile(e.target.files[0]);
//     };

//     const submitPersonalInfo = async () => {
//         try {
//             // Verificar si el usuario ya tiene un perfil (por ejemplo, comprobando si el email está vacío)
//             if (!userData.email || !userData.username) {
//                 // Si no tiene datos, es el primer ingreso y se hace un POST para insertarlos
//                 await axios.post('http://localhost:3000/user/profile/personal', {
//                     firstName: userData.firstName,
//                     lastName: userData.lastName,
//                     email: userData.email,
//                     phoneNumber: userData.phoneNumber,
//                     username: userData.username,
//                     address: userData.address,
//                     city: userData.city,
//                     barrio: userData.barrio,
//                     dob: userData.dob
//                 });
//                 alert("Información personal registrada con éxito.");
//             } else {
//                 // Si ya tiene datos, entonces hace un PUT para actualizar
//                 await axios.put('http://localhost:3000/user/profile/personal', {
//                     firstName: userData.firstName,
//                     lastName: userData.lastName,
//                     email: userData.email,
//                     phoneNumber: userData.phoneNumber,
//                     username: userData.username,
//                     address: userData.address,
//                     city: userData.city,
//                     barrio: userData.barrio,
//                     dob: userData.dob
//                 });
//                 alert("Información personal actualizada con éxito.");
//             }
//         } catch (error) {
//             console.error("Error al actualizar la información personal:", error);
//             alert("Error al actualizar la información personal.");
//         }
//     };

//     const submitWorkInfo = async () => {
//         try {
//             await axios.put('user/profile/work', {
//                 profesion: userData.profesion,
//                 exp: userData.exp,
//                 refe: userData.refe,
//                 link: userData.link
//             });
//             alert("Información laboral actualizada con éxito.");
//         } catch (error) {
//             console.error("Error actualizando información laboral:", error);
//             alert("Error al actualizar información laboral.");
//         }
//     };

//     const submitSchoolInfo = async () => {
//         try {
//             await axios.put('user/profile/education', {
//                 colegio: userData.colegio,
//                 tituloPro: userData.tituloPro,
//                 tituloTec: userData.tituloTec
//             });
//             alert("Información escolar actualizada con éxito.");
//         } catch (error) {
//             console.error("Error actualizando información escolar:", error);
//             alert("Error al actualizar información escolar.");
//         }
//     };
//     const submitBio = async () => {
//         try {
//             await axios.put('user/profile/bio', {
//                 bio: userData.bio,
//             });
//             alert("Biografia actualizada con éxito.");
//         } catch (error) {
//             console.error("Error actualizando biografia: ", error);
//             alert("Error al actualizar biografia.");
//         }
//     };

//     const handleCvSubmit = async () => {
//         if (!cvFile) return alert("No se ha seleccionado un archivo.");
    
//         const formData = new FormData();
//         formData.append("cvFile", cvFile);
    
//         try {
//             await axios.post('user/upload-cv', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             alert("CV enviado exitosamente.");
//         } catch (error) {
//             console.error("Error al enviar el CV:", error);
//             alert("Error al enviar el CV.");
//         }
//     };

//     useEffect(() => {
//         loadUserData();  // Cargar datos del usuario cuando el componente se monta
//     }, []);

    return (
        <>
        <div className="container mx-auto p-4 flex flex-col bg-blue-200 ">
            <form className="bg-white p-6 rounded-lg shadow-md mt-24 mb-16 ">
                <h2 className="text-3xl font-semibold mb-4 text-center ">Editar Perfil</h2>    

                <div className="flex flex-col items-center mb-4 border-2 rounded-lg py-10">
                    {/* Visualización de la imagen de perfil */}
                    {profilePic ? (
                        <img 
                            src={URL.createObjectURL(profilePic)} 
                            alt="Profile Preview" 
                            className="w-56 h-56 object-cover rounded-full mb-4"
                        />
                    ) : userData.pic_path ? (
                        <img 
                            src={`http://localhost:3000/uploads/${userData.pic_path}`}
                            alt="profilePic" 
                            className="w-56 h-56 object-cover rounded-full mb-4"
                        />
                    ) : (
                        <div className="w-56 h-56 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
                            <span className="text-gray-500">Sin foto de perfil</span>
                        </div>
                    )}
                    
                    {/* Controles para la imagen de perfil */}
                    <div className="flex space-x-2">
                        <label htmlFor="profilePic" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors">
                            Seleccionar Imagen
                        </label>
                        <input 
                            id="profilePic" 
                            type="file" 
                            onChange={handleProfilePicChange}
                            accept="image/*"
                            className="hidden" 
                        />
                        {profilePic && (
                            <>
                                <button 
                                    type="button" 
                                    onClick={handleProfilePicSubmit}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                >
                                    Guardar Imagen
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setProfilePic(null)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                    <div className="w-full flex justify-center mb-4 mt-5 ">
                        <textarea 
                            name="bio" 
                            value={userData.bio} 
                            onChange={handleChange} 
                            placeholder="Agregar Biografia aqui..." 
                            className="border p-2 rounded w-3/4 h-24 text-center"
                        />
                    </div>
                    <button onClick={submitBio} className=" w-3/12 min-w-80 text-zinc-700 hover:text-[#3b92a3] backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-6 shadow hover:shadow-[#57a5b5] duration-700">
                    Guardar Bio</button>
                </div>

                <div className="flex flex-col gap-4 border-grey-300 py-5 px-5 border-2 rounded-lg">
                <h2 className="color-black text-2xl font-semibold" >Informacion Personal</h2>
                    <h3 className="color-black text-sm font-semibold">Nombre</h3>
                    <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} placeholder="Jhon" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Apellido</h3>
                    <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} placeholder="Doe" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Email</h3>
                    <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="JhonDoe@mail.com" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Telefono</h3>
                    <input type="text" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} placeholder="3124567890" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Nombre de Usuario</h3>
                    <input type="text" name="username" value={userData.username} onChange={handleChange} placeholder="JhonD-2001" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Direccion</h3>
                    <input type="text" name="address" value={userData.address} onChange={handleChange} placeholder="Cra xx - sur" className="border p-2 rounded w-full col-span-2" />
                    <h3 className="color-black text-sm font-semibold">Ciudad</h3>
                    <input type="text" name="city" value={userData.city} onChange={handleChange} placeholder="ciudad" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Barrio</h3>
                    <input type="text" name="barrio" value={userData.barrio} onChange={handleChange} placeholder="Barrio" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Fecha de Nacimiento</h3>
                    <input type="text" name="dob" value={userData.dob} onChange={handleChange} placeholder="Año-Mes-Dia 2000-07-24" className="border p-2 rounded w-full" />
                    <button onClick={submitPersonalInfo} className=" w-3/12 min-w-80 text-zinc-700 hover:text-[#3b92a3] backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-6 shadow hover:shadow-[#57a5b5] duration-700">
                    Guardar Información Personal</button>

                </div>
                <div className="flex flex-col gap-4 border-grey-300 py-5 px-5 border-2 rounded-lg my-5">
                <h2 className="color-black text-2xl font-semibold" >Informacion Laboral</h2>
                    <h3 className="color-black text-sm font-semibold">Nombre de su Profesion</h3>
                    <input type="text" name="profesion" value={userData.profesion} onChange={handleChange} placeholder="Carpintero" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Años de experiencia</h3>
                    <input type="text" name="Exp" value={userData.exp} onChange={handleChange} placeholder="3 Años" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Referencia Personal</h3>
                    <input type="text" name="refe" value={userData.refe} onChange={handleChange} placeholder="Jefes/Clientes previos" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Perfil Linkedln / Facebook</h3>
                    <input type="text" name="link" value={userData.link} onChange={handleChange} placeholder="https://facebook.com/xyz" className="border p-2 rounded w-full" />
                    <button onClick={submitWorkInfo} className=" w-3/12 min-w-80 text-zinc-700 hover:text-[#3b92a3] backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-6 shadow hover:shadow-[#57a5b5] duration-700">
                    Guardar Información Laboral</button>
                </div>

                <div className="flex flex-col gap-4 border-grey-300 py-5 px-5 border-2 rounded-lg">
                <h3 className="color-black text-sm font-semibold">Nivel escolar</h3>
                    <input type="text" name="colegio" value={userData.colegio} onChange={handleChange} placeholder="Bachiller" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Titulo Profesional</h3>
                    <input type="text" name="tituloPro" value={userData.tituloPro} onChange={handleChange} placeholder="Solo si aplica" className="border p-2 rounded w-full" />
                    <h3 className="color-black text-sm font-semibold">Titulo Tecnico/Tecnologo</h3>
                    <input type="text" name="tituloTec" value={userData.tituloTec} onChange={handleChange} placeholder="Solo si aplica" className="border p-2 rounded w-full" />
                    <button onClick={submitSchoolInfo} className=" w-3/12 min-w-80 text-zinc-700 hover:text-[#3b92a3] backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-6 shadow hover:shadow-[#57a5b5] duration-700">
                    Guardar Información Escolar</button>
                </div>

            </form>
        </div>
        </>
    );
};

export default Profile;
