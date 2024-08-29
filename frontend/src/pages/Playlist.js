import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import PlayListCard from '../components/PlayListCard';
import Reproductor from '../components/Reproductor';
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
                        <Row>
                            {/* Aquí va contenido principal */}
                            <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ overflow: 'hidden', marginBottom :'100px' }}>
                                <PlayListCard songs={songs} fetchSongs={fetchSongs} iduser={userid} returnSongs={onReturnSongs}/>
                            </div>
                        </Row>
                        <Row>
                            {/* Reproductor fijo en la parte inferior */}
                            <div style={{ position: 'fixed', bottom: 0, left: isExpanded ? '250px' : '80px', right: 0, transition: 'left 0.5s ease-in-out', zIndex: 1000 }}>
                                <Reproductor />
                            </div>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Playlist;