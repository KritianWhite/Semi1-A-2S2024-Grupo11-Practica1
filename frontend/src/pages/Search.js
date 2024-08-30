import React, { useEffect, useState } from 'react';
import { Container, Col, Form } from 'react-bootstrap';
import { useLocation, Navigate } from 'react-router-dom';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import TablaCanciones from '../components/TablaCanciones';
import Alertas from '../components/Alertas';

const HomePage = () => {
    const [songs, setSongs] = useState([]);
    const [songsFiltradas, setSongsFiltradas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userid, setUserId] = useState();
    const { isAdmin, hasAccessToRoute } = UseAuth();
    const location = useLocation();

    useEffect(() => {
        // Si el usuario no tiene acceso a la ruta actual, redirige a una página de error o a la página principal
        if (!hasAccessToRoute(location.pathname)) {
            return <Navigate to="/404" />;
        }

        // Obtenemos el id del usuario almacenado en el localStorage
        let storedAuthData = JSON.parse(localStorage.getItem('authData'));
        let storedUserId = storedAuthData.userId;

        setUserId(storedUserId);
        // Realizamos una petición a la base de datos para obtener todas las canciones
        fetch('http://localhost:4000/song/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idusuario: storedAuthData.userId }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setSongs(data);
            })
            .catch((error) => {
                console.error('Error:', error);
                Alertas.showToast('Ocurrió un error al intentar obtener las canciones', 'error');
            });
    }, []);

    const handleToggleFavorite = (songId, es_favorito) => {
        // Realiza una petición a la base de datos para marcar o desmarcar la canción como favorita
        let apiUri = `http://localhost:4000/favorites/`;
        if (es_favorito) {
            apiUri += 'removesong';
        } else {
            apiUri += 'addsong';
        }
        fetch(apiUri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ iduser: userid, idsong: songId }),
        })
            .then((response) => response.json())
            .then((data) => {
                Alertas.showToast(data.message, 'success');
                // Actualiza la lista de canciones para reflejar el cambio en la interfaz
                let updatedSongs = songsFiltradas.map((song) => {
                    if (song.id === songId) {
                        return { ...song, es_favorito: !es_favorito };
                    }
                    return song;
                });
                setSongsFiltradas(updatedSongs);

                updatedSongs = songs.map((song) => {
                    if (song.id === songId) {
                        return { ...song, es_favorito: !es_favorito };
                    }
                    return song;
                });
                setSongs(updatedSongs);
            })
            .catch((error) => {
                console.error('Error:', error);
                Alertas.showToast('Ocurrió un error al intentar realizar la operación', 'error');
            });
    }

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        if (term === '') {
            setSongsFiltradas([]);
            return;
        }

        const filteredSongs = songs.filter(song =>
            song.nombre.toLowerCase().includes(term) ||
            song.artista.toLowerCase().includes(term)
        );

        setSongsFiltradas(filteredSongs);
    }

    return (
        <>
            <Container>
                <Col xs="auto">
                    <Sidebar isAdmin={isAdmin} />
                </Col>
                <Col xs="auto">
                    <h1 className="mb-4">¿Qué quieres reproducir?</h1>
                    
                    {/* Barra de búsqueda */}
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre o autor..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="mb-4"
                    />

                    {songsFiltradas.length === 0 ? (
                        <p></p>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center">
                            <TablaCanciones songs={songsFiltradas} onToggleFavorite={handleToggleFavorite} userId={userid} screen={'home'} />
                        </div>
                    )}
                </Col>
            </Container>
        </>
    );
}

export default HomePage;