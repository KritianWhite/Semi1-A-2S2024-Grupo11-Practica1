import React, { useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, Navigate } from 'react-router-dom';

import UseAuth from './auxiliares/UseAuth';
import Sidebar from '../components/Sidebar';
import AdminView from "../components/admin/AdminView";

const DashboardAdmin = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isAdmin, hasAccessToRoute } = UseAuth();
    const location = useLocation();

    // Si el usuario no tiene acceso a la ruta actual, redirige a una página de error o a la página principal
    if (!hasAccessToRoute(location.pathname)) {
        return <Navigate to="/404" />;
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={isExpanded ? 3 : 1}
                        className={`p-0 transition-col sidebar-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}
                        onMouseEnter={() => setIsExpanded(true)}
                        onMouseLeave={() => setIsExpanded(false)} 
                        style={{ transition: 'all 0.5s ease-in-out' }}>
                        <Sidebar isAdmin={isAdmin} />
                    </Col>
                    <Col
                        xs={isExpanded ? 9 : 11}
                        className={`transition-col content-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}
                        style={{ transition: 'all 0.5s ease-in-out', overflowX: 'hidden', marginBottom: '20vh'}}
                    >
                        {/* Aquí va contenido principal */}
                        <AdminView />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default DashboardAdmin;