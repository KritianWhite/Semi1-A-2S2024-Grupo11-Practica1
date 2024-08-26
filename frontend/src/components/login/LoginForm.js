import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        // Aquí simulamos la autenticación
        if (username === 'admin' && password === 'admin') {
            navigate('/HomeAdmin');
        } else if (username === 'sub' && password === 'sub') {
            navigate('/HomeSuscriptor');
        } else {
            alert('Credenciales incorrectas');
        }
    };


    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Usuario/Correo"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox" className="mb-3 d-flex justify-content-between">
                    <Form.Check type="checkbox" label="Recordar mis credenciales" />
                    <a href="/Registrarse" className="text-primary">Registrarse</a>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" style={{
                    backgroundColor: '#1a73e8',
                    borderColor: '#1a73e8',
                    borderRadius: '25px'
                }}>
                    Iniciar sesion
                </Button>
            </Form>
        </>
    );
};

export default LoginForm;
