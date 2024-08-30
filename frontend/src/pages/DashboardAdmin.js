import React, { useState } from "react";
import { Container, Col } from 'react-bootstrap';
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
            <Container>
                <Col xs="auto">
                    <Sidebar isAdmin={isAdmin} />
                </Col>
                <Col xs="auto">
                    <div className="d-flex justify-content-center align-items-center">
                        {/* Aquí va contenido principal */}
                        <AdminView />
                    </div>
                </Col>
            </Container>
        </>
    );
}

export default DashboardAdmin;