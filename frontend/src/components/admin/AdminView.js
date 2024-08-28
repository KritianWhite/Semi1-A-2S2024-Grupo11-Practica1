import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import SongList from './SongList';
import SongForm from './SongForm';
import SongDetails from './SongDetails';
import UpdateFileForm from './UpdateFileForm';
import Alertas from '../Alertas';

const AdminView = () => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showUpdatePhotoForm, setShowUpdatePhotoForm] = useState(false);
    const [showUpdateMp3Form, setShowUpdateMp3Form] = useState(false);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch('http://localhost:4000/song/list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener las canciones');
                }
                const data = await response.json();
                setSongs(data);
            } catch (error) {
                console.error('Error:', error);
                Alertas.showToast(error.message, 'error');
            }
        };

        fetchSongs();
    }, []);

    const handleCreateOrUpdate = (newSong) => {
        if (currentSong) {
            setSongs(
                songs.map((song) =>
                    song.nombre === currentSong.nombre ? { ...newSong } : song
                )
            );
        } else {
            setSongs([...songs, newSong]);
        }
        setShowForm(false);
        setCurrentSong(null);
    };

    const handleUpdatePhoto = (updatedPhoto) => {
        setSongs(
            songs.map((song) =>
                song.nombre === currentSong.nombre
                    ? { ...song, url_caratula: updatedPhoto}
                    : song
            )
        );
        //actualizamos la caratura de la cancion actual
        let song = {...currentSong, url_caratula: updatedPhoto};
        handleShowDetail(song);
        setShowUpdatePhotoForm(false);
    };

    const handleUpdateMp3 = (updatedMp3) => {
        setSongs(
            songs.map((song) =>
                song.nombre === currentSong.nombre
                    ? { ...song, url_mp3: updatedMp3 }
                    : song
            )
        );
        let song = {...currentSong, url_mp3: updatedMp3};
        setShowUpdateMp3Form(false);
        handleShowDetail(song);
    };

    const handleEdit = (song) => {
        setCurrentSong(song);
        setShowForm(true);
    };

    const handleDelete = (songId) => {
        // Eliminar la canción del servidor
        fetch('http://localhost:4000/song/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idcancion: songId }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    Alertas.showToast(data.message, 'success');
                    setSongs(songs.filter((song) => song.id !== songId));
                } else {
                    Alertas.showToast(data.message, 'error');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                Alertas.showToast(error.message, 'error');
            });
    };

    const handleShowDetail = (song) => {
        setCurrentSong(song);
    };

    const handleShowCreateForm = () => {
        setCurrentSong(null);
        setShowForm(true);
    };

    const handleShowUpdatePhotoForm = (song) => {
        setCurrentSong(song);
        setShowUpdatePhotoForm(true);
    };

    const handleShowUpdateMp3Form = (song) => {
        setCurrentSong(song);
        setShowUpdateMp3Form(true);
    };

    return (
        <Container>
            <h2 className="my-4">Administrador - Canciones</h2>
            <Row>
                <Col md={8}>
                    <Button variant="primary" onClick={handleShowCreateForm}>
                        Crear Nueva Canción
                    </Button>
                    <br />
                    <br />
                    <br />
                    <SongList
                        songs={songs}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onShowDetail={handleShowDetail}
                        onUpdatePhoto={handleShowUpdatePhotoForm}
                        onUpdateMp3={handleShowUpdateMp3Form}
                    />
                </Col>
                <Col md={4}>
                    <SongDetails song={currentSong} />
                </Col>
            </Row>

            <Modal show={showForm} onHide={() => setShowForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentSong ? 'Actualizar Canción' : 'Crear Nueva Canción'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SongForm
                        initialData={currentSong}
                        onSubmit={handleCreateOrUpdate}
                        onCancel={() => setShowForm(false)}
                    />
                </Modal.Body>
            </Modal>

            <Modal show={showUpdatePhotoForm} onHide={() => setShowUpdatePhotoForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar Foto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UpdateFileForm
                        fileType="imagen"
                        onSubmit={handleUpdatePhoto}
                        onCancel={() => setShowUpdatePhotoForm(false)}
                        accept="image/*"
                        idSong = {currentSong? currentSong.id : null}
                    />
                </Modal.Body>
            </Modal>

            <Modal show={showUpdateMp3Form} onHide={() => setShowUpdateMp3Form(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar Archivo MP3</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UpdateFileForm
                        fileType="mp3"
                        onSubmit={handleUpdateMp3}
                        onCancel={() => setShowUpdateMp3Form(false)}
                        accept="audio/*"
                        idSong = {currentSong? currentSong.id : null}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminView;
