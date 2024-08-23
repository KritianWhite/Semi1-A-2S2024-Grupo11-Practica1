// src/pages/RegisterPage.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RegisterForm from '../../components/login/RegistrarForm';

function RegisterPage() {
  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(to bottom, #72c2fc, #f9dd94)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={4}>
            <div className="register-box p-4" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)'
            }}>
              <h2 className="text-center mb-4">REGISTRARSE</h2>
              <RegisterForm />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RegisterPage;
