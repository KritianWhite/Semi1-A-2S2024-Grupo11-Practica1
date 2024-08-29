import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { PlayerProvider } from "./context/PlayerContext";

import Bienvenida from "./pages/Bienvenida";
import LoginPage from "./pages/login/LoginPages";
import RegistrarPage from "./pages/login/RegistrarPage";
import HomeAdmin from "./pages/HomePage";
import Perfil from "./pages/Perfil";
import Playlist from "./pages/Playlist";
import Favoritos from "./pages/Favoritos";
import Radio from "./pages/Radio";
import DashboardAdmin from "./pages/DashboardAdmin";
import TrackLocation from "./pages/auxiliares/TrackLocation";
import NotFound from "./pages/NotFound";
import Reproductor from "./components/Reproductor";

function App() {
  return (
    <>
      <PlayerProvider>
        <Router>
          <TrackLocation />
          <Routes>
            <Route path="/" element={<Bienvenida />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Registrarse" element={<RegistrarPage />} />
            <Route path="/Inicio" element={<HomeAdmin />} />
            <Route path="/Perfil" element={<Perfil />} />
            <Route path="/Playlist" element={<Playlist />} />
            <Route path="/Favoritos" element={<Favoritos />} />
            <Route path="/Radio" element={<Radio />} />
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
          <Reproductor />
        </Router>
      </PlayerProvider>
    </>
  );
}

export default App;
