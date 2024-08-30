import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image, Row, Col } from 'react-bootstrap';
import './styles/Sidebar.css';
import UseAuth from '../pages/auxiliares/UseAuth';

const Sidebar = ({ isAdmin }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { logout } = UseAuth();

    const handleLogout = () => {
        logout();
    }

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
                {isExpanded && (
                    <Col xs="auto" className="d-flex align-items-center">
                        <Link to="/Login" onClick={handleLogout} className="text-white">
                            <i className="bi bi-box-arrow-right" style={{ fontSize: '1.5rem', marginLeft: "1rem" }}></i>
                        </Link>
                    </Col>
                )}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="flex-column w-100">
                    <Nav.Item>
                        <Nav.Link as={Link} to="/Inicio" className="d-flex align-items-center">
                            <i className="bi bi-house-door"></i>
                            {isExpanded && <span>Inicio</span>}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/search" className="d-flex align-items-center">
                            <i className="bi bi-search"></i>
                            {isExpanded && <span>Busqueda</span>}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/Perfil" className="d-flex align-items-center">
                            <i className="bi bi-person"></i>
                            {isExpanded && <span>Perfil</span>}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/Playlist" className="d-flex align-items-center">
                            <i className="bi bi-music-note-list"></i>
                            {isExpanded && <span>Playlist</span>}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/Favoritos" className="d-flex align-items-center">
                            <i className="bi bi-heart"></i>
                            {isExpanded && <span>Favoritos</span>}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/Radio" className="d-flex align-items-center">
                            <i className="bi bi-broadcast"></i>
                            {isExpanded && <span>Radio</span>}
                        </Nav.Link>
                    </Nav.Item>
                    {isAdmin && (
                        <Nav.Item>
                            <Nav.Link as={Link} to="/dashboard-admin" className="d-flex align-items-center">
                                <i className="bi bi-gear"></i>
                                {isExpanded && <span>Administrador</span>}
                            </Nav.Link>
                        </Nav.Item>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Sidebar;
