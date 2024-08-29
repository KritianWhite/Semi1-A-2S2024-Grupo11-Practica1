import React, { useState, useEffect } from 'react';
import { Container, Col } from 'react-bootstrap';
import { useLocation, Navigate } from 'react-router-dom';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import TablaCanciones from '../components/TablaCanciones';
import Alertas from '../components/Alertas';

const Favoritos = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [songs, setSongs] = useState([]);
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
        // realizamos una petición a la base de datos para obtener las canciones recientes
        fetch('http://localhost:4000/favorites/getsongs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ iduser: storedAuthData.userId }),
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
                if (data.status !== 200) {
                    console.log(data);
                    Alertas.showToast(data.message, 'error');
                    return;
                }
                console.log(data);
                Alertas.showToast(data.message, 'success');
                // Actualiza la lista de canciones para reflejar el cambio en la interfaz
                let updatedSongs = songs.map((song) => {
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

    return (
        <>
            <Container>
                <Col xs="auto">
                    <Sidebar isAdmin={isAdmin} />
                </Col>
                <Col xs="auto">
                    {/* Aquí va contenido principal */}
                    <h1>TUS FAVORITOS</h1>
                    <div className="d-flex justify-content-center align-items-center">
                        <TablaCanciones songs={songs} onToggleFavorite={handleToggleFavorite} userId={userid} />
                    </div>
                </Col>
            </Container>
        </>
    );
}

export default Favoritos;