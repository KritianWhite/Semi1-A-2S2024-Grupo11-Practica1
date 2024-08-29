import React, { useContext } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { PlayerContext } from '../context/PlayerContext'; // Asegúrate de que la ruta sea correcta

const TablaCanciones = ({ songs, onToggleFavorite }) => {
  const { playSong } = useContext(PlayerContext); // Importa la función playSong del contexto

  const handlePlayPause = (song) => {
    playSong(song);  // Enviar la canción seleccionada al reproductor
  };

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
          {songs.map((song, index) => (
            <tr key={index} className="align-middle">
              <td className="p-3">
                <Row className="align-items-center">
                  <Col xs="auto">
                    <Button
                      variant="link"
                      onClick={() => handlePlayPause(song)}
                      className="text-dark"
                    >
                      <i className="bi bi-play-circle"></i>
                    </Button>
                  </Col>
                  <Col>{song.nombre}</Col>
                </Row>
              </td>
              <td className="p-3">{song.artista}</td>
              <td className="p-3">{song.duracion}</td>
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
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TablaCanciones;
