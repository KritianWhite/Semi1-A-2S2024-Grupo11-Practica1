import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import  useAuth  from '../../pages/auxiliares/UseAuth';
import  Alertas  from '../Alertas';

const LoginForm = () => {
    const [email, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            email,
            password
        };

        fetch('http://localhost:4000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if(data.role === 1){
                    login(data.id, true);
                    navigate('/Inicio');
                }else if(data.role === 2){
                    login(data.id, false);
                    navigate('/Inicio');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                Alertas.showToast('error', 'Ocurrío un error al iniciar sesión');
        });

    };


    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Usuario/Correo"
                        value={email}
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
