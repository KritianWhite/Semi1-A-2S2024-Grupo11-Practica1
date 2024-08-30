import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import TablaCanciones from './TablaCanciones';
import PlayListForm from './playlist/PlayListForm.js';
import Alertas from './Alertas.js';
import UpdatePortadaForm from './playlist/UpdatePortadaForm.js';
import { path_lb } from '../config.js';

const PlaylistGrid = ({ songs, fetchSongs, iduser }) => {
  const [showForm, setShowForm] = useState(false);
  const [showSongs, setShowSongs] = useState(false);
  const [showUpdatePhotoForm, setShowUpdatePhotoForm] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const handlePlaylistClick = async (playlistId) => {
    setSelectedPlaylist(playlistId);
    setShowSongs(true);
    // Enviar el idplaylist y actualizar las canciones
    fetchSongs({ idplaylist: playlistId });
  };

  useEffect(() => {
    // Obtenemos el id del usuario almacenado en el localStorage
    let storedAuthData = JSON.parse(localStorage.getItem('authData'));
    let storedUserId = storedAuthData.userId;
    const fetchPlaylists = async () => {
      try {
        const response = await fetch( path_lb + '/playlist/getall', {
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
    setShowUpdatePhotoForm(false);
    setSelectedPlaylist(null);
    setShowForm(false);
    setShowSongs(false);
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

  const handleCancel = () => {
    setShowForm(false);
    setSelectedPlaylist(null);
    setShowSongs(false);
    setShowUpdatePhotoForm(false);
  };

  const handleVolver = () => {
    setSelectedPlaylist(null);
    setShowSongs(false);
    setShowForm(false);
    setShowUpdatePhotoForm(false);
  }

  const handleDelete = (playlist) => {
    console.log(playlist);
    // Eliminar playlist
    fetch( path_lb + '/playlist/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idplaylist: playlist.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          Alertas.showToast(data.message, 'success');
          setPlaylists(playlists.filter((p) => p.id !== playlist.id));
        } else {
          Alertas.showToast(data.message, 'error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Alertas.showToast(error.message, 'error');
      });
  }

  const handleRemoveSong = () => {
    //volver a cargar las canciones
    fetchSongs({ idplaylist: selectedPlaylist });
  }


  return (
    <Container>
      {selectedPlaylist && showSongs ? (
        <>
          <Button variant="link" onClick={() => handleVolver()}>Volver</Button>
          <TablaCanciones songs={songs} screen={'playlist'} playlistId={selectedPlaylist} removeSongFromPlayList={handleRemoveSong}/>
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
                <Card className="h-100 cursor-pointer" style={{ cursor: 'pointer' }}>
                  <Card.Img variant="top" onClick={() => handlePlaylistClick(playlist.id)} src={playlist.url_portada} alt={playlist.nombre} />
                  <Card.Body>
                    <Card.Title onClick={() => handlePlaylistClick(playlist.id)}>{playlist.nombre}</Card.Title>
                    <Card.Text onClick={() => handlePlaylistClick(playlist.id)}>{playlist.descripcion}</Card.Text>
                    <Row>
                      <Col></Col>
                      <Col>
                        <Button
                          variant="button"
                          title='Editar'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(playlist);
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant="button"
                          title='Cambiar Portada'
                          onClick={(e) => { e.stopPropagation(); handleShowUpdatePhotoForm(playlist); }}
                        >
                          <i className="bi bi-images"></i>
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant="button"
                          title='Eliminar'
                          onClick={(e) => { e.stopPropagation(); handleDelete(playlist); }}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </Col>

                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Modal show={showForm} onHide={() => handleCancel()}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedPlaylist ? 'Actualizar Playlist' : 'Nueva Playlist'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PlayListForm
                initialData={selectedPlaylist}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => handleCancel()}
                idUser={iduser}
              />
            </Modal.Body>
          </Modal>

          <Modal show={showUpdatePhotoForm} onHide={() => handleCancel()}>
            <Modal.Header closeButton>
              <Modal.Title>Actualizar Foto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <UpdatePortadaForm
                onSubmit={handleUpdatePhoto}
                onCancel={() => handleCancel()}
                idPlayList={selectedPlaylist ? selectedPlaylist.id : null}
              />
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default PlaylistGrid;