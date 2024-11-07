import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Outlet } from 'react-router-dom';



function MainLayout() {
    return (
      <>
        <Header />
        <main>
          <Outlet /> {/* Este Outlet renderiza el contenido de cada página */}
        </main>
        <Footer />
      </>
    );
  }

export default MainLayout;

//  poner este lay out dependiendo la pagina llevar el impor y  <Header /> en cada pagina para mañana :))