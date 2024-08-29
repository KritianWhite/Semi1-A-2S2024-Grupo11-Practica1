import React, { useState } from 'react';
import { Container, Col } from 'react-bootstrap';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import RadioCard from '../components/RadioCard';

const Radio = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isAdmin } = UseAuth();

    const songs = [
        { idsong: 1, nombre: 'Dance of the Mommoths', artista: 'The Whole Other', duracion: '1:50' },
        { idsong: 2, nombre: 'Luxery', artista: 'Caustic', duracion: '3:03' },
        { idsong: 3, nombre: 'Regrets', artista: 'Caustic', duracion: '3:17' },
        { idsong: 4, nombre: 'Project', artista: 'Patrick Patrikios', duracion: '3:30' },
    ];

    return (
        <>
            <Container>
                <Col xs="auto">
                    <Sidebar isAdmin={isAdmin} />
                </Col>
                <Col xs="auto">
                    {/* Aquí va contenido principal */}
                    <h1>Radio SOUNDSTREAM</h1>
                    <div className="d-flex justify-content-center align-items-center">
                        <RadioCard songs={songs} />
                    </div>
                </Col>
            </Container>
        </>
    );
}

export default Radio;