import React, {useContext, useEffect, useState } from 'react';
import { Container, Col } from 'react-bootstrap';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import RadioCard from '../components/RadioCard';
import { PlayerContext } from '../context/PlayerContext';

const Radio = () => {
    const { resetSong } = useContext(PlayerContext); // Importa la función playSong del contexto
    const [isExpanded, setIsExpanded] = useState(false);
    const [songs, setSongs] = useState([]);
    const { isAdmin } = UseAuth();

    useEffect(() => {
        resetSong(); // Detener la reproducción de la canción actual
        // Realizar petición a la base de datos para obtener todas las canciones
        fetch('http://localhost:4000/song/list')
            .then(response => response.json())
            .then(data => {
                setSongs(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <>
            <Container>
                <Col xs="auto">
                    <Sidebar isAdmin={isAdmin} />
                </Col>
                <Col xs="auto">
                    {/* Aquí va contenido principal */}
                    <h1>Radio SOUNDSTREAM</h1>
                    <div className="d-flex justify-content-center align-items-center">
                        <RadioCard songs={songs} />
                    </div>
                </Col>
            </Container>
        </>
    );
}

export default Radio;