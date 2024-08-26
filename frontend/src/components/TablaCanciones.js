import React, { useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';

const TablaCanciones = ({ songs }) => {
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
            <th>GENERO</th>
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
                  <Col>{song.title}</Col>
                </Row>
              </td>
              <td className="p-3">{song.artist}</td>
              <td className="p-3">{song.genre}</td>
              <td className="p-3 text-end">{song.duration}</td>
              <td className="p-3 text-end">
                <i className="bi bi-soundwave text-dark"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TablaCanciones;
