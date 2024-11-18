import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Offers = () => {

  


  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch jobs from backend
  useEffect(() => {
    // Fetch para obtener trabajos
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:3000/user/findjobs"); // Cambia esta URL si es diferente
        if (!response.ok) {
          throw new Error("Error al obtener los trabajos");
        }
        const data = await response.json();
        setJobs(data.jobs); // Asigna los trabajos al estado
        setLoading(false); // Desactiva el estado de carga
      } catch (err) {
        console.error(err);
        setError(err.message); // Captura cualquier error
        setLoading(false); // Desactiva el estado de carga
      }
    };

    fetchJobs();
  }, []);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  // Handle search
  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/search?query=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Error al buscar trabajos');
      }
      const jobsData = await response.json();
      setJobs(jobsData); // Guardar los trabajos encontrados
    } catch (error) {
      console.error('Error:', error);
      setJobs([]); // Si hay un error, vaciar los trabajos
    }
  };

  // Hook de efecto para ejecutar la búsqueda cuando el término cambie
  useEffect(() => {
    if (searchTerm.length > 0) {
      handleSearch(); // Buscar si el término de búsqueda cambia
    } else {
      setJobs([]); // Si no hay término de búsqueda, vaciar la lista
    }
  }, [searchTerm]);
    return (
        <>
        <div className="flex flex-row mx-auto p-4 pt-36 h-screen justify-center" style={{background: "linear-gradient(180deg, rgba(35,100,115,1) 0%, rgba(87,165,181,1) 23%, rgba(173,204,210,1) 100%)"}}>
            {/* Search Section */}
            <div className="w-2/3 bg-gradient-to-b from-[#e7fbff] shadow-md rounded-md p-8 ">
            <h2 className="text-2xl font-bold mb-4">Encuentra o ofrece un servicio</h2>
                <div className="mb-8">
                    <div className="flex gap-2">
                    <input
                        type="text"
                        className="border rounded px-4 py-2 w-full"
                        placeholder="Buscar por profesión o nombre de usuario"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Buscar
                    </button>
                    </div>
                </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <div
                        key={job.id}
                        className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <h3 className="text-xl font-bold">{job.titulo}</h3>
                        <p className="text-sm text-gray-600">Publicado por: {job.firstName} {job.lastName}</p>
                        <p className="mt-2">{job.descripcion}</p>
                        <p className="mt-2 text-sm font-semibold text-blue-500">
                          Salario: {job.salario}
                        </p>
                        <p className="mt-2 text-sm">Contacto: {job.contacto}</p>
                      </div>
                    ))
                  ) : (
                    <p>No se encontraron trabajos que coincidan con la búsqueda.</p>
                  )}
                </div>
            </div>
        </div>
        
    </>
    );
};

export default Offers;