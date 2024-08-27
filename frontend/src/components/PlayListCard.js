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
    <Container>
      {selectedPlaylist ? (
        <>
          <Button variant="link" onClick={() => setSelectedPlaylist(null)}>Volver</Button>
          <TablaCanciones songs={songs} />
        </>
      ) : (
        <>
          <h2 className="mb-4">PLAYLIST AGREGADAS</h2>
          <Row>
            {playlists.map((playlist) => (
              <Col key={playlist.idplaylist} xs={6} md={4} lg={3} className="mb-4">
                <Card onClick={() => handlePlaylistClick(playlist.idplaylist)} className="h-100 cursor-pointer">
                  <Card.Img variant="top" src={playlist.portada} alt={playlist.nombre} />
                  <Card.Body>
                    <Card.Title>{playlist.nombre}</Card.Title>
                    <Card.Text>{playlist.descripcion}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default PlaylistGrid;
