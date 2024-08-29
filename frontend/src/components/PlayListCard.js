import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import TablaCanciones from './TablaCanciones';

const PlaylistGrid = ({ playlists, fetchSongs }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);

  const handlePlaylistClick = async (playlistId) => {
    setSelectedPlaylist(playlistId);

    // Enviar el idplaylist y recibir las canciones
    const fetchedSongs = await fetchSongs({ idplaylist: playlistId });
    setSongs(fetchedSongs);
  };

  return (
    <>
      <Container>
        {selectedPlaylist ? (
          <>
            <Button variant="link" onClick={() => setSelectedPlaylist(null)}>Volver</Button>
            <TablaCanciones songs={songs} />
          </>
        ) : (
          <Row>
            {playlists.map((playlist) => (
              <Col key={playlist.idplaylist} xs={6} md={4} lg={3} className="mb-4 d-flex flex-column">
                <Card
                  onClick={() => handlePlaylistClick(playlist.idplaylist)}
                  className="mt-auto h-100 cursor-pointer shadow-sm border-0"
                  style={{ borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Card.Img variant="top" src={playlist.portada} alt={playlist.nombre} style={{ height: '200px', objectFit: 'cover' }} />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-truncate">{playlist.nombre}</Card.Title>
                    <Card.Text className="text-muted">{playlist.descripcion}</Card.Text>
                    <Button variant="primary" className="mt-auto">Ver Canciones</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default PlaylistGrid;
