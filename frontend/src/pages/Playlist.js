import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import PlayListCard from '../components/PlayListCard';
import Alertas from '../components/Alertas';

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
        console.log('Obteniendo canciones de la playlist con id:', idplaylist);
        fetch ('http://localhost:4000/playlist/getsongs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idplaylist: idplaylist }),
        })
            .then((response) => {
                if (!response.ok) {
                    console.log(response);
                    Alertas.showToast('Error al obtener las canciones', 'error');
                    return;
                }
                return response.json();
            })
            .then((data) => {
                
                setSongs(data);
            })
            .catch((error) => {
                console.error('Error:', error);
                Alertas.showToast(error.message, 'error');
            });
    };

    const onReturnSongs = (songs) => {
        setSongs(songs);
    }

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
                        <PlayListCard songs={songs} fetchSongs={fetchSongs} iduser={userid} returnSongs={onReturnSongs}/>
                    </div>
                </Col>
                                
            </Container>
        </>
    );
}

export default Playlist;