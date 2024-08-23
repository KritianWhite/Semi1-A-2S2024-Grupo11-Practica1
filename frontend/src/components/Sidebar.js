import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image, Row, Col } from 'react-bootstrap';
import './styles/Sidebar.css'; // Archivo CSS personalizado

const Sidebar = ({ isAdmin }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Navbar
            expand="lg"
            className={`d-flex flex-column sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <Navbar.Brand className="d-flex align-items-center justify-content-center">
                <i className="bi bi-music-note-list logo-icon"></i>
                {isExpanded && <span>SOUNDSTREAM</span>}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="flex-column w-100">
                    <Nav.Item>
                        <Nav.Link as={Link} to="/" className="d-flex align-items-center">
                            <i className="bi bi-house-door"></i>
                            {isExpanded && <span>Inicio</span>}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/perfil" className="d-flex align-items-center">
                            <i className="bi bi-person"></i>
                            {isExpanded && <span>Perfil</span>}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/playlist" className="d-flex align-items-center">
                            <i className="bi bi-music-note-list"></i>
                            {isExpanded && <span>Playlist</span>}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/favoritos" className="d-flex align-items-center">
                            <i className="bi bi-heart"></i>
                            {isExpanded && <span>Favoritos</span>}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/radio" className="d-flex align-items-center">
                            <i className="bi bi-broadcast"></i>
                            {isExpanded && <span>Radio</span>}
                        </Nav.Link>
                    </Nav.Item>
                    {isAdmin && (
                        <Nav.Item>
                            <Nav.Link as={Link} to="/administrador" className="d-flex align-items-center">
                                <i className="bi bi-gear"></i>
                                {isExpanded && <span>Administrador</span>}
                            </Nav.Link>
                        </Nav.Item>
                    )}
                </Nav>
            </Navbar.Collapse>
            <Row className="profile-section align-items-center justify-content-between">
                <Col xs="auto" className="d-flex align-items-center">
                    <Image src="/path/to/profile.jpg" roundedCircle />
                    {isExpanded && (
                        <p className="text-white mb-0 ml-2">Nombre Usuario</p>
                    )}
                </Col>
                {isExpanded && (
                    <Col xs="auto" className="d-flex align-items-center">
                        <Link to="/logout" className="text-white">
                            <i className="bi bi-box-arrow-right" style={{ fontSize: '1.5rem' }}></i>
                        </Link>
                    </Col>
                )}
            </Row>
        </Navbar>
    );
};

export default Sidebar;
