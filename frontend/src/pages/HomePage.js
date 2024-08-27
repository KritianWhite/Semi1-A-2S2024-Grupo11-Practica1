import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, Navigate } from 'react-router-dom';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import TablaCanciones from '../components/TablaCanciones';
import Reproductor from '../components/Reproductor';

const AdminPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { userId, isAdmin, hasAccessToRoute } = UseAuth();
  const location = useLocation();

  // Si el usuario no tiene acceso a la ruta actual, redirige a una página de error o a la página principal
  if (!hasAccessToRoute(location.pathname)) {
    return <Navigate to="/404" />;
  }
  const songs = [
    { idsong: 1, nombre: 'Dance of the Mommoths', artista: 'The Whole Other', duracion: '1:50' },
    { idsong: 2, nombre: 'Luxery', artista: 'Caustic', duracion: '3:03' },
    { idsong: 3, nombre: 'Regrets', artista: 'Caustic', duracion: '3:17' },
    { idsong: 4, nombre: 'Project', artista: 'Patrick Patrikios', duracion: '3:30' },
  ];

  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={isExpanded ? 3 : 1}
            className={`p-0 transition-col sidebar-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)} style={{ transition: 'all 0.5s ease-in-out' }}>
            <Sidebar isAdmin={isAdmin} />
          </Col>
          <Col
            xs={isExpanded ? 9 : 11}
            className={`transition-col content-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}
            style={{ transition: 'all 0.5s ease-in-out', overflowX: 'hidden' }}
          >
            {/* Aquí va contenido principal */}
            <h1>Bienvenido a SOUNDSTREAM</h1>
            <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ overflow: 'hidden' }}>
              <TablaCanciones songs={songs} />
            </div>

            {/* Reproductor fijo en la parte inferior */}
            <div style={{ position: 'fixed', bottom: 0, left: isExpanded ? '250px' : '80px', right: 0, transition: 'left 0.5s ease-in-out', zIndex: 1000 }}>
              <Reproductor />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AdminPage;
