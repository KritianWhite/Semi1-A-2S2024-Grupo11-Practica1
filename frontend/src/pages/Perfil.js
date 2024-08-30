import React, { useState } from 'react';
import { Container, Col } from 'react-bootstrap';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import PerfilForm from '../components/PerfilForm';

const Perfil = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isAdmin } = UseAuth();

    return (
        <>
            <Container>
                    <Col xs="auto">
                        <Sidebar isAdmin={isAdmin} />
                    </Col>
                    <Col xs="auto">
                        {/* Aquí va contenido principal */}
                        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ overflow: 'hidden' }}>
                            <PerfilForm />
                        </div>
                    </Col>
                </Container>
            </>

            );
}

            export default Perfil;