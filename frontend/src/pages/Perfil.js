import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import PerfilForm from '../components/PerfilForm';
import Reproductor from '../components/Reproductor';

const Perfil = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isAdmin } = UseAuth();

    return (
        <>
            <Container fluid>
                <Row>
                    <Col
                        xs={isExpanded ? 3 : 1}
                        className={`p-0 transition-col sidebar-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}
                        onMouseEnter={() => setIsExpanded(true)}
                        onMouseLeave={() => setIsExpanded(false)}
                        style={{ transition: 'all 0.5s ease-in-out' }}
                    >
                        <Sidebar isAdmin={isAdmin} />
                    </Col>
                    <Col
                        xs={isExpanded ? 9 : 11}
                        className={`transition-col content-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}
                        style={{ transition: 'all 0.5s ease-in-out', overflowX: 'hidden' }}
                    >
                        {/* Aquí va contenido principal */}
                        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ overflow: 'hidden' }}>
                            <PerfilForm />
                        </div>

                        {/* Reproductor fijo en la parte inferior */}
                        <div
                            style={{
                                position: 'fixed',
                                bottom: 0,
                                left: isExpanded ? '250px' : '80px',
                                right: 0,
                                transition: 'left 0.5s ease-in-out',
                                zIndex: 1000,
                            }}
                        >
                            <Reproductor />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>

    );
}

export default Perfil;