import React, { useState } from 'react';
import { Container, Col } from 'react-bootstrap';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import PlayListCard from '../components/PlayListCard';

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
            <Container>
                <Col xs="auto">
                    <Sidebar isAdmin={isAdmin} />
                </Col>
                <Col xs="auto">
                    {/* Aquí va contenido principal */}
                    <h1 className="mb-4">Playlist</h1>
                    <div className="d-flex justify-content-center align-items-center">
                        <PlayListCard playlists={playlists} fetchSongs={fetchSongs} />
                    </div>
                </Col>
            </Container>
        </>
    );
}

export default Playlist;