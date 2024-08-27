import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import './styles/Bienvenida.css';

const Bienvenida = () => {
  return (
    <div>
      <Container fluid className="welcome-page">
        <Row className="justify-content-start">
          <Col md={6}>
            <div className="welcome-box p-4">
              <h1 className="display-4 mb-3">BIENVENIDO A</h1>
              <h2 className="display-5 mb-3">SOUNDSTREAM</h2>
              <p className="lead mb-4">El lugar de tu música favorita</p>
              <Button variant="btn btn-light" size="lg" href="/Login">
                Iniciar sesión
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Bienvenida;
