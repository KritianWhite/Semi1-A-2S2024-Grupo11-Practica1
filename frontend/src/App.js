import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from "./pages/login/LoginPages";
import RegistrarPage from "./pages/login/RegistrarPage";
import HomeAdmin from "./pages/administrador/HomePage";
import HomeSuscriptor from "./pages/suscriptor/HomePage";
import Perfil from "./pages/Perfil";
import Playlist from "./pages/Playlist";
import Favoritos from "./pages/Favoritos";
import Radio from "./pages/Radio";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Registrar" element={<RegistrarPage />} />
          <Route path="/HomeAdmin" element={<HomeAdmin />} />
          <Route path="/HomeSuscriptor" element={<HomeSuscriptor />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/Playlist" element={<Playlist />} />
          <Route path="/Favoritos" element={<Favoritos />} />
          <Route path="/Radio" element={<Radio />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
