import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';

const Reproductor = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const duration = 220; // Duración de la canción en segundos

    useEffect(() => {
        let interval = null;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime((prevTime) => {
                    if (prevTime < duration) {
                        return prevTime + 1;
                    } else {
                        clearInterval(interval);
                        return prevTime;
                    }
                });
            }, 1000);
        } else if (!isPlaying && currentTime !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentTime, duration]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (event) => {
        const boundingRect = event.target.getBoundingClientRect();
        const clickPosition = event.clientX - boundingRect.left;
        const progressBarWidth = boundingRect.width;
        const newTime = (duration * clickPosition) / progressBarWidth;
        setCurrentTime(Math.max(0, Math.min(newTime, duration))); // Aseguramos que el tiempo esté dentro de los límites
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <Container fluid className="bg-light py-3">
            <Row className="align-items-center">
                <Col xs={2}>
                    {/* Imagen del álbum */}
                    <img
                        src="https://ew.com/thmb/4bHTaBOHh6vEoPdHRYqWniwucD8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/freshprince-2000-3721b9e6bf09448ba6ef0210319ccfa1.jpg"
                        alt="Album Art"
                        style={{ width: '80px', height: '80px', borderRadius: '10px' }}
                    />
                </Col>
                <Col xs={4} className="text-start">
                    <div>Song Name</div>
                    <div className="text-muted">Artist Name</div>
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col xs={10} style={{ position: 'relative' }}>
                            <ProgressBar
                                now={(currentTime / duration) * 100}
                                className="mb-2"
                                style={{ height: '5px', cursor: 'pointer' }}
                                onMouseDown={handleProgressChange}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '1px',  // Ajustamos la posición vertical
                                    left: `${(currentTime / duration) * 100}%`,
                                    transform: 'translateX(0%) translateY(-50%)',  // Ajuste de transformación (desplazamiento del puntero)
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: 'red',
                                    borderRadius: '50%',
                                    pointerEvents: 'none',
                                }}
                            ></div>
                            <div className="d-flex justify-content-between">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </Col>
                        <Col xs={2} className="text-end">
                            <i
                                className={`bi bi-heart${isLiked ? '-fill' : ''}`}
                                style={{ color: isLiked ? 'red' : 'black', cursor: 'pointer' }}
                                onClick={handleLike}
                            ></i>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col xs={2} className="text-center">
                            <i className="bi bi-shuffle" style={{ cursor: 'pointer' }}></i>
                        </Col>
                        <Col xs={2} className="text-center">
                            <i className="bi bi-skip-backward-fill" style={{ cursor: 'pointer' }}></i>
                        </Col>
                        <Col xs={2} className="text-center">
                            <i
                                className={`bi bi-${isPlaying ? 'pause' : 'play'}-fill`}
                                style={{ cursor: 'pointer' }}
                                onClick={handlePlayPause}
                            ></i>
                        </Col>
                        <Col xs={2} className="text-center">
                            <i className="bi bi-skip-forward-fill" style={{ cursor: 'pointer' }}></i>
                        </Col>
                        <Col xs={2} className="text-center">
                            <i className="bi bi-arrow-repeat" style={{ cursor: 'pointer' }}></i>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Reproductor;
