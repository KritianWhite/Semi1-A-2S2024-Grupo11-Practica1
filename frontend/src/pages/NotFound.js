import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const goBack = () => {
        const previousPath = localStorage.getItem('previousPath');
        if (previousPath) {
            console.log(previousPath);
            navigate(previousPath);
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh', textAlign: 'center' }}>
                <Row>
                    <Col>
                        <img src="https://cdna.artstation.com/p/assets/images/images/050/392/546/original/nelson-tiapa-gif-cohete-en-vuelo.gif?1654733307" alt="Rocket" style={{ width: '150px', marginBottom: '30px' }} />
                        <h1 className="display-4">Página no encontrada</h1>
                        <p className="text-muted">
                            Lo sentimos, no se pudo encontrar la página que solicitó.
                            <br />
                            Por favor regrese a la página de anterior.
                        </p>
                        <Button
                            variant="primary"
                            onClick={goBack}
                            style={{ borderRadius: '30px', backgroundColor: '#5cb85c', borderColor: '#5cb85c', padding: '10px 30px' }}
                        >
                            <i className="bi bi-arrow-left" style={{ marginRight: '10px' }}></i>
                            Regresar
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default NotFoundPage;
