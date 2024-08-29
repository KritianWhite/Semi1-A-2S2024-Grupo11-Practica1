import React, { useState } from 'react';
import { Container, Button, Image } from 'react-bootstrap';

const RadioCard = ({ songs }) => {
  // Seleccionar una canción aleatoria al iniciar
  const initialSong = songs && songs.length > 0 ? songs[Math.floor(Math.random() * songs.length)] : null;
  const [currentSong, setCurrentSong] = useState(initialSong);

  const playRandomSong = () => {
    if (songs && songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSong(songs[randomIndex]);
    } else {
      setCurrentSong(null);
    }
  };

  const handlePlayPause = () => {
    const audio = document.getElementById('audio-player');
    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  return (
    <Container
      fluid
      className="radio-container d-flex flex-column align-items-center justify-content-center p-4"
      style={{
        backgroundColor: '#1c1c1e',
        height: 'auto',
        maxHeight: '80vh',
        color: 'white',
        overflow: 'hidden',
        padding: '20px',
        borderRadius: '15px',
      }}
    >
      {currentSong ? (
        <>
          <Image
            src={currentSong.url_imagen || "https://i.pinimg.com/236x/57/3c/18/573c189ea32ea0e5a4c06a508ad7462c.jpg"}
            rounded
            className="mb-4"
            style={{ width: '250px', height: '250px', objectFit: 'cover' }}
          />
          <h2 className="text-center">{currentSong.nombre}</h2>
          <p className="text-center text-muted">{currentSong.artista}</p>
          <audio id="audio-player" src={currentSong.url_mp3} autoPlay />
          <div className="d-flex align-items-center justify-content-center mt-3">
            <Button variant="link" className="text-white mx-3" onClick={handlePlayPause}>
              <i className="bi bi-play-circle" id="play-pause-icon" style={{ fontSize: '3rem' }}></i>
            </Button>
            <Button variant="link" className="text-white mx-3" onClick={playRandomSong}>
              <i className="bi bi-skip-forward" style={{ fontSize: '1.5rem' }}></i>
            </Button>
          </div>
        </>
      ) : (
        <p>No hay canciones disponibles.</p>
      )}
    </Container>
  );
};

export default RadioCard;
