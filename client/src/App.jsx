import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import SimpleLayout from './Layout/SimpleLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Contact from './pages/Contact'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route element={<SimpleLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
