import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import TablaCanciones from './TablaCanciones';
import PlayListForm from './playlist/PlayListForm.js';
import Alertas from './Alertas.js';

const PlaylistGrid = ({ songs, fetchSongs, iduser }) => {
  const [showForm, setShowForm] = useState(false);
  const [showUpdatePhotoForm, setShowUpdatePhotoForm] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const handlePlaylistClick = async (playlistId) => {
    setSelectedPlaylist(playlistId);

    // Enviar el idplaylist y actualizar las canciones
    const fetchedSongs = await fetchSongs({ idplaylist: playlistId });
    //setSongs(fetchedSongs);
  };

  useEffect(() => {
    // Obtenemos el id del usuario almacenado en el localStorage
    let storedAuthData = JSON.parse(localStorage.getItem('authData'));
    let storedUserId = storedAuthData.userId;
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
          Alertas.showToast('Error al obtener las playlists', 'error');
          return;
        }
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPlaylists();
  }, []);

  const handleCreateOrUpdate = (newPlayList) => {
    console.log(newPlayList);
    if (selectedPlaylist) {
      setPlaylists(
        playlists.map((playlist) =>
          playlist.id === selectedPlaylist.id ? { ...newPlayList } : playlist
        )
      );
    } else {
      setPlaylists([...playlists, newPlayList]);
    }
    setShowForm(false);
    setSelectedPlaylist(null);
  };

  const handleUpdatePhoto = (updatedPhoto) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === selectedPlaylist.id
          ? { ...playlist, url_portada: updatedPhoto }
          : playlist
      )
    );
    //actualizamos la caratura de la cancion actual
    let playlist = { ...playlist, url_portada: updatedPhoto };
    setShowUpdatePhotoForm(false);
  };

  const handleEdit = (playlist) => {
    setSelectedPlaylist(playlist);
    setShowForm(true);
  };

  const handleShowCreateForm = () => {
    setSelectedPlaylist(null);
    setShowForm(true);
  };

  const handleShowUpdatePhotoForm = (playlist) => {
    setSelectedPlaylist(playlist);
    setShowUpdatePhotoForm(true);
  };



  return (
    <Container>
      {selectedPlaylist ? (
        <>
          <Button variant="link" onClick={() => setSelectedPlaylist(null)}>Volver</Button>
          <TablaCanciones songs={songs} />
        </>
      ) : (
        <>
          <Row className="align-items-center mb-4">
            <Col>
              <h2>TUS PLAYLIST</h2>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleShowCreateForm} style={{ width: '20vh' }}>
                Crear Playlist
              </Button>
            </Col>
          </Row>

          <Row>
            {playlists.map((playlist) => (
              <Col key={playlist.id} xs={6} md={4} lg={3} className="mb-4">
                <Card onClick={() => handlePlaylistClick(playlist.id)} className="h-100 cursor-pointer">
                  <Card.Img variant="top" src={playlist.url_portada} alt={playlist.nombre} />
                  <Card.Body>
                    <Card.Title>{playlist.nombre}</Card.Title>
                    <Card.Text>{playlist.descripcion}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Modal show={showForm} onHide={() => setShowForm(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedPlaylist ? 'Actualizar Playlist' : 'Nueva Playlist'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PlayListForm
                initialData={selectedPlaylist}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => setShowForm(false)}
                idUser={iduser}
              />
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default PlaylistGrid;
