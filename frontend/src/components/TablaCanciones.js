import React, { useContext, useState } from 'react';
import { Table, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { PlayerContext } from '../context/PlayerContext'; // Asegúrate de que la ruta sea correcta
import Alertas from './Alertas';
import AddToPlaylistForm from './playlist/AddToPlaylistForm';

const TablaCanciones = ({ songs, userId, onToggleFavorite, screen, playlistId, removeSongFromPlayList }) => {
  const { playSong } = useContext(PlayerContext); // Importa la función playSong del contexto
  const [currentSong, setCurrentSong] = useState(null); //para la reproducción de canciones
  const [showFormPlaylist, setShowFormPlaylist] = useState(false); //para mostrar el modal de agregar a playlist
  const [songToPlaylist, setSongToPlaylist] = useState(null); //para guardar la canción a agregar a un playlist

  const handlePlayPause = (song) => {
    playSong(song);  // Enviar la canción seleccionada al reproductor
  };

  const handleCancelForm = () => {
    setShowFormPlaylist(false);
  }

  const handleAddToPlaylist = () => {
    setShowFormPlaylist(false);
    setSongToPlaylist(null);
  }

  const handleOpenForm = (song) => {
    setSongToPlaylist(song);
    setShowFormPlaylist(true);
  }

  const handleDeleteFromPlaylist = (idCancion) => {
    console.log('Eliminando canción de la playlist', idCancion);
    console.log('Playlist:', playlistId);
    // Realiza una petición a la base de datos para eliminar la canción de la playlist
    fetch('http://localhost:4000/playlist/removesong', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idplaylist: playlistId, idsong: idCancion }),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          Alertas.showToast('Error al eliminar la canción de la playlist', 'error');
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 200) {
          Alertas.showToast('Canción eliminada de la playlist', 'success');
          // Actualiza la lista de canciones para reflejar el cambio en la interfaz
          removeSongFromPlayList(); // Actualiza la lista de canciones de la playlist en el componente Playlist
        }else{
          Alertas.showToast(data.message, 'error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Alertas.showToast('Error al eliminar la canción de la playlist', 'error');
      });
  }

  return (
    <Container>
      <Table hover borderless>
        <thead>
          <tr>
            <th>TITULO</th>
            <th>ARTISTA</th>
            <th>DURACION</th>
          </tr>
        </thead>
        <tbody>
          {songs !== undefined ? (
            songs.map((song, index) => (
              <tr
                key={index}
                className="align-middle"
              >
                <td className="p-3">
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <Button
                        variant="link"
                        onClick={() => handlePlayPause(song)}
                        className="text-dark"
                      >
                        <i className={`bi ${currentSong === index ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                      </Button>
                    </Col>
                    <Col>{song.nombre}</Col>
                  </Row>
                </td>
                <td className="p-3">{song.artista}</td>
                <td className="p-3">{song.duracion}</td>
                {screen !== 'playlist' && (
                  <td className="p-3 text-end">
                    <Button
                      variant="link"
                      onClick={() => onToggleFavorite(song.id, song.es_favorito)}
                      className="text-danger"
                      title={song.es_favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <i className={`bi ${song.es_favorito ? 'bi-heart-fill' : 'bi-heart'}`} ></i>
                    </Button>
                  </td>
                )}
                {(screen !== 'home' && screen !== 'favorites') && (

                  <td className="p-3 text-end">
                    <Button onClick={() => handleDeleteFromPlaylist(song.id)} variant="link" className='text-dark' title="Remover de la playlist">
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                )}
                {screen !== 'playlist' && (
                  <td className="p-3 text-end">
                    <Button onClick={() => handleOpenForm(song)} variant="link" className="text-primary" title="Agregar a playlist">
                      <i className="bi bi-bookmark-plus"></i>
                    </Button>
                  </td>
                )}
              </tr>
            )

            )) : (<></>)}
        </tbody>
      </Table>
      <Modal show={showFormPlaylist} onHide={() => handleCancelForm()}>
        <Modal.Header closeButton>
          <Modal.Title>Selecciona una Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddToPlaylistForm
            onSubmit={handleAddToPlaylist}
            onCancel={() => handleCancelForm()}
            idCancion={songToPlaylist ? songToPlaylist.id : null}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCancelForm()}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>

  );
};

export default TablaCanciones;
