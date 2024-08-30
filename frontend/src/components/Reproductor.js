import React, { useContext, useRef, useEffect } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import ReactAudioPlayer from 'react-audio-player';
import { Container, Row, Col, Image } from 'react-bootstrap';

const Reproductor = () => {
    const { currentSong, setPlayerHeight } = useContext(PlayerContext);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current && audioRef.current.audioEl.current) {
            const audioElement = audioRef.current.audioEl.current;
            // Deshabilita las opciones de descarga, pantalla completa, y reproducción remota
            audioElement.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');

            // Opcionalmente, podrías aplicar CSS para intentar ocultar el menú de opciones, pero esto no es garantizado para todos los navegadores
            const moreOptionsButton = audioElement.parentElement.querySelector('.audio-more-options');
            if (moreOptionsButton) {
                moreOptionsButton.style.display = 'none'; // Oculta el botón de más opciones si existe
            }
        }

        // Actualiza la altura del reproductor cuando se monta o cambia la canción
        if (currentSong) {
            setPlayerHeight(150); // Ajusta la altura cuando hay una canción (este valor es solo un ejemplo)
        } else {
            setPlayerHeight(60); // Altura mínima cuando no hay canción
        }

    }, [currentSong, setPlayerHeight]);

    return (
        <Container
            fluid
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#282c34',
                color: 'white',
                padding: '10px',
                boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            {currentSong ? (
                <Row style={{ width: '100%' }} className="align-items-center">
                    <Col xs="auto">
                        <Image
                            src={currentSong.url_caratula}
                            rounded
                            style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '5px'
                            }}
                            alt={currentSong.nombre}
                        />
                    </Col>
                    <Col style={{ flex: 1, marginLeft: '10px' }}>
                        <h5 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{currentSong.nombre}</h5>
                        <p style={{ margin: 0, fontSize: '14px', color: '#d3d3d3' }}>{currentSong.artista}</p>
                        <ReactAudioPlayer
                            src={currentSong.url_mp3}
                            autoPlay
                            controls
                            ref={audioRef}
                            style={{ width: '100%', marginTop: '10px' }}
                        />
                    </Col>
                </Row>
            ) : (
                <p className="text-center mb-0"></p>
            )}
        </Container>
    );
};

export default Reproductor;
