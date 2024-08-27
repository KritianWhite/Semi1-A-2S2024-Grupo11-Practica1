import React, { useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';

const TablaCanciones = ({ songs }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [favorites, setFavorites] = useState({});

  const handlePlayPause = (index) => {
    if (currentSong === index) {
      setCurrentSong(null); // Pausar la canción actual
    } else {
      setCurrentSong(index); // Reproducir una nueva canción
    }
  };

  const toggleFavorite = (songId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [songId]: !prevFavorites[songId],
    }));
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
                  onClick={() => toggleFavorite(song.idsong)}
                  className="text-danger"
                >
                  <i className={`bi ${favorites[song.idsong] ? 'bi-heart-fill' : 'bi-heart'}`}></i>
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
