import React, { useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import Alertas from './Alertas';

const TablaCanciones = ({ songs, userId, onToggleFavorite }) => {
  const [currentSong, setCurrentSong] = useState(null);

  const handlePlayPause = (index) => {
    if (currentSong === index) {
      setCurrentSong(null); // Pausar la canción actual
    } else {
      setCurrentSong(index); // Reproducir una nueva canción
    }
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
            <tr
              key={index}
              className={`align-middle ${currentSong === index ? 'bg-dark text-white' : ''}`}
              style={{
                borderRadius: '10px',
                border: '1px solid #E9ECEF',
                marginBottom: '15px',
              }}
            >
              <td className="p-3">
                <Row className="align-items-center">
                  <Col xs="auto">
                    <Button
                      variant="link"
                      onClick={() => handlePlayPause(index)}
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
