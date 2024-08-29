import React, { useEffect } from 'react';
import { useState } from 'react';
import { Modal, Button, ListGroup, Row, Col, Image } from 'react-bootstrap';
import Alertas from '../Alertas';

const AddToPlaylistForm = ({ onSubmit, idCancion }) => {
    const [playlists, setPlaylists] = useState([]);
    const [idUser, setIdUser] = useState(0);

    useEffect(() => {
        // Obtenemos el id del usuario almacenado en el localStorage
        let storedAuthData = JSON.parse(localStorage.getItem('authData'));
        let storedUserId = storedAuthData.userId;
        setIdUser(storedUserId);
        const fetchPlaylists = async () => {
            try {
                const response = await fetch('http://localhost:4000/playlist/getall', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ iduser: storedUserId }),
                });
                if (!response.ok) {
                    console.log(response);
                    Alertas.showToast('Error al obtener las playlists', 'error');
                    return;
                }
                const data = await response.json();
                setPlaylists(data);
            } catch (error) {
                console.error('Error:', error);
                Alertas.showToast(error.message, 'error');
            }
        };

        fetchPlaylists();
    }, []);

    const handleAddToPlaylist = (idPlaylist) => {
        //hacemos la petición al servidor

        let api_uri = 'http://localhost:4000/playlist/addsong';
        let data = { iduser: idUser, idplaylist: idPlaylist, idsong: idCancion };

        fetch(api_uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    console.log(response);
                    Alertas.showToast('Error al agregar la canción a la playlist', 'error');
                }
                return response.json();
            })
            .then((data) => {
                if (data.status === 200) {
                    Alertas.showToast(data.message, 'success');
                    onSubmit();
                } else {
                    Alertas.showToast(data.message, 'warning');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                Alertas.showToast(error.message, 'error');
            });

    }

    return (
        <ListGroup>
            {playlists.map((playlist) => (
                <ListGroup.Item
                    key={playlist.id}
                    action
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    style={{ cursor: 'pointer' }}
                >
                    <Row>
                        <Col>
                            <Image src={playlist.url_portada} roundedCircle style={{ maxHeight: '30px', maxWidth: '30px' }} />
                        </Col>
                        <Col>
                            {playlist.nombre}
                        </Col>
                    </Row>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default AddToPlaylistForm;