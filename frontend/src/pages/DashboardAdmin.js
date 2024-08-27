import React, { useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, Navigate } from 'react-router-dom';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import AdminView from "../components/admin/AdminView";
import Reproductor from '../components/Reproductor';

const DashboardAdmin = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isAdmin, hasAccessToRoute } = UseAuth();
    const location = useLocation();

    // Si el usuario no tiene acceso a la ruta actual, redirige a una página de error o a la página principal
    // if (!hasAccessToRoute(location.pathname)) {
    //     return <Navigate to="/404" />;
    // }

    const initialSongs = [
        {
            "nombre": "Bohemian Rhapsody",
            "imagen": "data:image/jpeg;base64,...",  // Reemplaza con una imagen en base64
            "duracion": "00:05:55",
            "artista": "Queen",
            "mp3": "data:audio/mp3;base64,..."  // Reemplaza con un archivo de audio en base64
        },
        {
            "nombre": "Stairway to Heaven",
            "imagen": "data:image/jpeg;base64,...",
            "duracion": "00:08:02",
            "artista": "Led Zeppelin",
            "mp3": "data:audio/mp3;base64,..."
        },
        {
            "nombre": "Hotel California",
            "imagen": "data:image/jpeg;base64,...",
            "duracion": "00:06:30",
            "artista": "Eagles",
            "mp3": "data:audio/mp3;base64,..."
        },
        {
            "nombre": "Imagine",
            "imagen": "data:image/jpeg;base64,...",
            "duracion": "00:03:03",
            "artista": "John Lennon",
            "mp3": "data:audio/mp3;base64,..."
        },
        {
            "nombre": "Smells Like Teen Spirit",
            "imagen": "data:image/jpeg;base64,...",
            "duracion": "00:05:01",
            "artista": "Nirvana",
            "mp3": "data:audio/mp3;base64,..."
        },
        {
            "nombre": "Sweet Child O' Mine",
            "imagen": "data:image/jpeg;base64,...",
            "duracion": "00:05:56",
            "artista": "Guns N' Roses",
            "mp3": "data:audio/mp3;base64,..."
        },
        {
            "nombre": "Hey Jude",
            "imagen": "data:image/jpeg;base64,...",
            "duracion": "00:07:08",
            "artista": "The Beatles",
            "mp3": "data:audio/mp3;base64,..."
        },
        {
            "nombre": "Wonderwall",
            "imagen": "data:image/jpeg;base64,...",
            "duracion": "00:04:18",
            "artista": "Oasis",
            "mp3": "data:audio/mp3;base64,..."
        },
        {
            "nombre": "Purple Haze",
            "imagen": "data:image/jpeg;base64,...",
            "duracion": "00:02:50",
            "artista": "Jimi Hendrix",
            "mp3": "data:audio/mp3;base64,..."
        },
        {
            "nombre": "Billie Jean",
            "imagen": "data:image/jpeg;base64,...",
            "duracion": "00:04:54",
            "artista": "Michael Jackson",
            "mp3": "data:audio/mp3;base64,..."
        }
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
                        style={{ transition: 'all 0.5s ease-in-out', overflowX: 'hidden', marginBottom: '20vh'}}
                    >
                        {/* Aquí va contenido principal */}
                        <AdminView initialSongs={initialSongs} />

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

export default DashboardAdmin;