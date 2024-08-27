import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import PlayListCard from '../components/PlayListCard';
import Reproductor from '../components/Reproductor';

const Playlist = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isAdmin } = UseAuth();

    const playlists = [
        {
            idplaylist: 1,
            nombre: "playlist1",
            descripcion: "esta es una playlist",
            portada: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSbD-LQphj1tRogL4XQBW7wLTCwYdUktQ2Q&s", // Base64 de la imagen
        },
        {
            idplaylist: 2,
            nombre: "playlist2",
            descripcion: "esta es una playlist",
            portada: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSbD-LQphj1tRogL4XQBW7wLTCwYdUktQ2Q&s", // Base64 de la imagen
        },
        // Otras playlists
    ];

    const fetchSongs = async ({ idplaylist }) => {
        // Aquí realizarías la llamada a tu API para obtener las canciones
        // Supongamos que hacemos una petición ficticia
        const response = await new Promise((resolve) =>
            setTimeout(() => {
                resolve([
                    {
                        idsong: 1,
                        nombre: "cancion1",
                        url_imagen: "data:image/jpeg;base64,...",
                        duracion: "00:03:56",
                        artista: "artista1",
                        url_mp3: "data:audio/mp3;base64,...",
                    },
                    {
                        idsong: 2,
                        nombre: "cancion2",
                        url_imagen: "data:image/jpeg;base64,...",
                        duracion: "00:25:03",
                        artista: "artista2",
                        url_mp3: "data:audio/mp3;base64,...",
                    },
                ]);
            }, 1000)
        );
        return response;
    };

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
                        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ overflow: 'hidden' }}>
                            <PlayListCard playlists={playlists} fetchSongs={fetchSongs} />
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

export default Playlist;