import React, { useState } from 'react';
import { Container, Col } from 'react-bootstrap';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import PlayListCard from '../components/PlayListCard';

const Playlist = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [songs, setSongs] = useState([]);
    const { isAdmin } = UseAuth();
    const [userid, setUserId] = useState();

    useEffect(() => {
        // Obtenemos el id del usuario almacenado en el localStorage
        let storedAuthData = JSON.parse(localStorage.getItem('authData'));
        let storedUserId = storedAuthData.userId;

        setUserId(storedUserId);
    }, []);


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